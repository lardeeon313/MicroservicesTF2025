using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using SalesService.Domain.Enums;
using SalesService.Domain.IRepositories;
using SharedKernel.IntegrationEvents.DepotEvents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace SalesService.Infraestructure.Messaging.Consumer
{
    public class OrderPreparedConsumer : BackgroundService
    {
        private readonly ILogger<OrderMissingConsumer> _logger;
        private readonly IConfiguration _config;
        private readonly IServiceScopeFactory _scopeFactory;

        public OrderPreparedConsumer(ILogger<OrderMissingConsumer> logger, IConfiguration config, IServiceScopeFactory scopeFactory)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _config = config ?? throw new ArgumentNullException(nameof(config));
            _scopeFactory = scopeFactory ?? throw new ArgumentNullException(nameof(scopeFactory));
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var factory = new ConnectionFactory
            {
                HostName = _config["RabbitMQ:Host"] ?? "rabbitmq",
                Port = int.Parse(_config["RabbitMQ:Port"] ?? "5672"),
                UserName = _config["RabbitMQ:Username"] ?? "guest",
                Password = _config["RabbitMQ:Password"] ?? "guest"
            };

            var connection = await factory.CreateConnectionAsync();
            var channel = await connection.CreateChannelAsync();

            await channel.QueueDeclareAsync(
                queue: "order_prepared_queue",
                durable: true,
                exclusive: false,
                autoDelete: false
            );

            var consumer = new AsyncEventingBasicConsumer(channel);

            consumer.ReceivedAsync += async (model, ea) =>
            {
                var json = Encoding.UTF8.GetString(ea.Body.ToArray());
                var evento = JsonSerializer.Deserialize<OrderPreparedIntegrationEvent>(json);

                if (evento is not null)
                {
                    using var scope = _scopeFactory.CreateScope();
                    var context = scope.ServiceProvider.GetRequiredService<SalesDbContext>();
                    var repository = scope.ServiceProvider.GetRequiredService<IOrderRepository>();

                    var salesOrder = await repository.GetByIdAsync(evento.SalesOrderId);

                    if (salesOrder != null)
                    {
                        salesOrder.Status = OrderStatus.Prepared;
                        await repository.UpdateAsync(salesOrder);
                        await context.SaveChangesAsync();
                        _logger.LogInformation($"Order {salesOrder.Id} has been marked as prepared.");
                    }
                    else
                    {
                        _logger.LogWarning($"Sales order with ID {evento.SalesOrderId} not found.");
                    }
                }
                else
                {
                    _logger.LogError("Received an invalid OrderPreparedIntegrationEvent.");
                }
            };
            await channel.BasicConsumeAsync(
                queue: "order_prepared_queue",
                autoAck: true,
                consumer: consumer
            );

            _logger.LogInformation("OrderPreparedConsumer is running and listening for messages on 'order_prepared_queue'.");

            await Task.CompletedTask;
        }
    }
}
