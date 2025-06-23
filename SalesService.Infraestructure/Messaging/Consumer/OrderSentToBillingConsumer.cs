using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client.Events;
using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SharedKernel.IntegrationEvents.DepotEvents;
using System.Text.Json;
using SalesService.Domain.IRepositories;
using SalesService.Domain.Enums;

namespace SalesService.Infraestructure.Messaging.Consumer
{
    public class OrderSentToBillingConsumer : BackgroundService
    {
        private readonly ILogger<OrderMissingConsumer> _logger;
        private readonly IConfiguration _config;
        private readonly IServiceScopeFactory _scopeFactory;

        public OrderSentToBillingConsumer(ILogger<OrderMissingConsumer> logger, IConfiguration config, IServiceScopeFactory scopeFactory)
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
                queue: "order_sent_billing_queue",
                durable: true,
                exclusive: false,
                autoDelete: false
            );

            var consumer = new AsyncEventingBasicConsumer(channel);

            consumer.ReceivedAsync += async (model, ea) =>
            {
                var json = Encoding.UTF8.GetString(ea.Body.ToArray());
                var evento = JsonSerializer.Deserialize<OrderSentToBillingIntegrationEvent>(json);

                if (evento != null)
                {
                    using var scope = _scopeFactory.CreateScope();
                    var context = scope.ServiceProvider.GetRequiredService<SalesDbContext>();
                    var repository = scope.ServiceProvider.GetRequiredService<IOrderRepository>();

                    var order = await repository.GetByIdAsync(evento.SalesOrderId);
                    if (order != null)
                    {
                        order.Status = OrderStatus.SentToBilling;
                        await repository.UpdateAsync(order);
                        await context.SaveChangesAsync();
                        _logger.LogInformation($"Order {order.Id} sent to billing successfully.");
                    }
                    else
                    {
                        _logger.LogWarning($"Order with ID {evento.SalesOrderId} not found.");
                    }
                }
                else
                {
                    _logger.LogWarning("Received an empty or null event.");
                }
            };

            await channel.BasicConsumeAsync(
                queue: "order_sent_billing_queue",
                autoAck: true,
                consumer: consumer
            );
            _logger.LogInformation("OrderSentToBillingConsumer started and listening for messages on 'order_sent_billing_queue'.");
            await Task.CompletedTask;
        }
    }
}
