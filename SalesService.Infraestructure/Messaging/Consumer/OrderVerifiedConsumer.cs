using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using SalesService.Domain.Entities.OrderEntity;
using SalesService.Domain.Enums;
using SalesService.Domain.IRepositories;
using SharedKernel.IntegrationEvents;
using SharedKernel.IntegrationEvents.LogisticEvents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace SalesService.Infraestructure.Messaging.Consumer
{
    /// <summary>
    /// Consumidor para eventos de pedidos Verificados.
    /// </summary>
    public class OrderVerifiedConsumer : BackgroundService
    {
        private readonly ILogger<OrderVerifiedConsumer> _logger;
        private readonly IConfiguration _config;
        private readonly IServiceScopeFactory _scopeFactory;

        public OrderVerifiedConsumer(ILogger<OrderVerifiedConsumer> logger, IConfiguration config, IServiceScopeFactory scopeFactory)
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
                queue: "order_verified_queue",
                durable: true,
                exclusive: false,
                autoDelete: false
            );

            var consumer = new AsyncEventingBasicConsumer(channel);

            consumer.ReceivedAsync += async (model, ea) =>
            {
                var json = Encoding.UTF8.GetString(ea.Body.ToArray());
                var evento = JsonSerializer.Deserialize<OrderVerifyIntegrationEvent>(json);

                if (evento is not null)
                {
                    using var scope = _scopeFactory.CreateScope();
                    var context = scope.ServiceProvider.GetRequiredService<SalesDbContext>();
                    var repository = scope.ServiceProvider.GetRequiredService<IOrderRepository>();

                    try
                    {
                        var salesOrder = await repository.GetByIdAsync(evento.SalesOrderId);

                        if (salesOrder != null)
                        {
                            // 🔹 Actualizar estado de la orden
                            salesOrder.Status = OrderStatus.Verify;

                            await repository.UpdateAsync(salesOrder);
                            await context.SaveChangesAsync();

                            _logger.LogInformation("✅ Order {OrderId} updated as Verified with items.", salesOrder.Id);

                            var statusHistory = new OrderStatusHistory
                            {
                                OrderId   = salesOrder.Id,
                                OldStatus = OrderStatus.PendingVerification,
                                NewStatus = OrderStatus.Verify,
                                ChangedAt = evento.VerifyAt,
                            };

                            await context.OrderStatusHistories.AddAsync(statusHistory);
                            await context.SaveChangesAsync();
                        }
                        else
                        {
                            _logger.LogWarning("⚠️ Order with ID {SalesOrderId} not found.", evento.SalesOrderId);
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "❌ Error updating sales order from event {SalesOrderId}", evento.SalesOrderId);
                    }
                }
                else
                {
                    _logger.LogWarning("⚠️ Received an empty or invalid OrderVerifyIntegrationEvent.");
                }
            };

            await channel.BasicConsumeAsync(
                queue: "order_verified_queue",
                autoAck: true,
                consumer: consumer
            );

            _logger.LogInformation("OrderInPreparationConsumer is running and listening for messages on 'order_verified_queue'.");

            await Task.CompletedTask;

        }
    }
}
