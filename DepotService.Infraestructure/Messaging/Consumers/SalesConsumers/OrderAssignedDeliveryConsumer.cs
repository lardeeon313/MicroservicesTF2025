using DepotService.Domain.Entities;
using DepotService.Domain.Enums;
using DepotService.Domain.IRepositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using SharedKernel.IntegrationEvents.LogisticEvents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace DepotService.Infraestructure.Messaging.Consumers.SalesConsumers
{
    /// <summary>
    /// Consumidor para eventos de pedidos Verificados.
    /// </summary>
    public class OrderAssignedDeliveryConsumer : BackgroundService
    {
        private readonly ILogger<OrderAssignedDeliveryConsumer> _logger;
        private readonly IConfiguration _config;
        private readonly IServiceScopeFactory _scopeFactory;

        public OrderAssignedDeliveryConsumer(ILogger<OrderAssignedDeliveryConsumer> logger, IConfiguration config, IServiceScopeFactory scopeFactory)
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
                queue: "order_assigned_delivery_queue",
                durable: true,
                exclusive: false,
                autoDelete: false
            );

            var consumer = new AsyncEventingBasicConsumer(channel);

            consumer.ReceivedAsync += async (model, ea) =>
            {
                var json = Encoding.UTF8.GetString(ea.Body.ToArray());
                var evento = JsonSerializer.Deserialize<OrderAssignDeliveryIntegrationEvent>(json);

                if (evento is not null)
                {
                    using var scope = _scopeFactory.CreateScope();
                    var context = scope.ServiceProvider.GetRequiredService<DepotDbContext>();
                    var repository = scope.ServiceProvider.GetRequiredService<IDepotOrderRepository>();

                    try
                    {
                        var depotOrder = await repository.GetByIdAsync(evento.DepotOrderId);

                        if (depotOrder != null)
                        {
                            // 🔹 Actualizar estado de la orden
                            depotOrder.Status = OrderStatus.Verify;

                            await repository.UpdateOrderAsync(depotOrder);
                            await context.SaveChangesAsync();

                            _logger.LogInformation("✅ Order {OrderId} updated as Verified with items.", depotOrder.DepotOrderId);

                            var statusHistory = new OrderStatusHistory
                            {
                                OrderId = depotOrder.DepotOrderId,
                                OldStatus = OrderStatus.SentToBilling,
                                NewStatus = OrderStatus.Invoiced,
                                ChangedAt = evento.AssignDeliveryAt,
                            };

                            await context.OrderStatusHistories.AddAsync(statusHistory);
                            await context.SaveChangesAsync();
                        }
                        else
                        {
                            _logger.LogWarning("⚠️ Order with ID {DepotOrderId} not found.", evento.DepotOrderId);
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "❌ Error updating depot order from event {DepotOrderId}", evento.DepotOrderId);
                    }
                }
                else
                {
                    _logger.LogWarning("⚠️ Received an empty or invalid OrderAssignDeliveryIntegrationEvent.");
                }
            };

            await channel.BasicConsumeAsync(
                queue: "order_invoiced_queue",
                autoAck: true,
                consumer: consumer
            );

            _logger.LogInformation("OrderInPreparationConsumer is running and listening for messages on 'order_assigndelivery_queue'.");

            await Task.CompletedTask;

        }
    }
}
