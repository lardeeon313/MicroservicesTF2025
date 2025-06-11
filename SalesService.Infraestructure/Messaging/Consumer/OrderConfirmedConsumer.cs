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
using Microsoft.EntityFrameworkCore;
using SalesService.Domain.Enums;

namespace SalesService.Infraestructure.Messaging.Consumer
{
    public class OrderConfirmedConsumer : BackgroundService
    {
        private readonly ILogger<OrderConfirmedConsumer> _logger;
        private readonly IConfiguration _config;
        private readonly IServiceScopeFactory _scopeFactory;

        public OrderConfirmedConsumer(ILogger<OrderConfirmedConsumer> logger, IConfiguration config, IServiceScopeFactory scopeFactory)
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
                queue: "order_confirmed_queue",
                durable: true,
                exclusive: false,
                autoDelete: false
            );

            var consumer = new AsyncEventingBasicConsumer(channel);

            consumer.ReceivedAsync += async (model, ea) =>
            {
                var json = Encoding.UTF8.GetString(ea.Body.ToArray());
                var evento = JsonSerializer.Deserialize<OrderConfirmedIntegrationEvent>(json);

                if (evento is not null)
                {
                    using var scope = _scopeFactory.CreateScope();
                    var context = scope.ServiceProvider.GetRequiredService<SalesDbContext>();

                    var order = await context.Orders
                        .FirstOrDefaultAsync(o => o.Id == evento.SalesOrderId);
                    if (order is not null)
                    {
                        order.Status = OrderStatus.Confirmed;
                        await context.SaveChangesAsync();
                        _logger.LogInformation("✅ Orden {SalesOrderId} confirmada a las {ConfirmedAt}",
                            order.Id, evento.ConfirmedAt);
                    }
                    else
                    {
                        _logger.LogWarning($"Order with ID {evento.SalesOrderId} not found.");
                    }
                }
                else
                {
                    _logger.LogWarning("Received an empty or invalid OrderMissingReportedIntegrationEvent.");
                }
            };

            await channel.BasicConsumeAsync(
                queue: "order_confirmed_queue",
                autoAck: true,
                consumer: consumer
            );

            await Task.CompletedTask;
        }
    }
}
