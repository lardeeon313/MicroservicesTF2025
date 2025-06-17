using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using SalesService.Domain.Entities.OrderEntity;
using SalesService.Domain.Enums;
using SharedKernel.IntegrationEvents.DepotEvents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace SalesService.Infraestructure.Messaging.Consumer
{
    public class OrderMissingConsumer : BackgroundService
    {
        private readonly ILogger<OrderMissingConsumer> _logger;
        private readonly IConfiguration _config;
        private readonly IServiceScopeFactory _scopeFactory;

        public OrderMissingConsumer(ILogger<OrderMissingConsumer> logger, IConfiguration config, IServiceScopeFactory scopeFactory)
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
                queue: "order_missing_queue",
                durable: true,
                exclusive: false,
                autoDelete: false
            );

            var consumer = new AsyncEventingBasicConsumer(channel);

            consumer.ReceivedAsync += async (model, ea) =>
            {
                var json = Encoding.UTF8.GetString(ea.Body.ToArray());
                var evento = JsonSerializer.Deserialize<OrderMissingReportedIntegrationEvent>(json);

                if (evento is not null)
                {
                    using var scope = _scopeFactory.CreateScope();
                    var context = scope.ServiceProvider.GetRequiredService<SalesDbContext>();

                    var order =  await context.Orders.FindAsync(evento.SalesOrderId);
                    if ( order is not null)
                    {
                        var orderMissing = new OrderMissing
                        {
                            MissingId = evento.MissingId,
                            OrderId = evento.SalesOrderId,
                            MissingReason = evento.MissingReason,
                            MissingDescription = evento.MissingDescription,
                            MissingDate = evento.ReportedAt,
                            MissingItems = evento.MissingItems.Select(item => new OrderMissingItem
                            {
                                OrderItemId = item.OrderItemId,
                                MissingQuantity = item.Quantity,
                            }).ToList(),
                        };

                        await context.OrderMissings.AddAsync(orderMissing);

                        order.Status = OrderStatus.PendingResolution;
                        await context.SaveChangesAsync(stoppingToken);
                        _logger.LogInformation($"Order with ID {evento.SalesOrderId} status updated to PendingResolution.");
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

            await channel.BasicConsumeAsync(queue: "order_missing_queue", autoAck: true, consumer: consumer);

            await Task.CompletedTask;

        }


    }
}
