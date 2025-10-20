using DepotService.Domain.Entities;
using DepotService.Domain.Enums;
using DepotService.Domain.IRepositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using SharedKernel.IntegrationEvents.SalesEvents.Order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace DepotService.Infraestructure.Messaging.Consumers.SalesConsumers
{
    /// <summary>
    /// Consumer para recibir eventos de órdenes eliminadas desde RabbitMQ.
    /// </summary>
    public class OrderDeletedConsumer : BackgroundService
    {
        private readonly ILogger<OrderDeletedConsumer> _logger;
        private IConfiguration _config;
        private readonly IServiceScopeFactory _scopeFactory;

        public OrderDeletedConsumer(
            ILogger<OrderDeletedConsumer> logger,
            IConfiguration config,
            IServiceScopeFactory scopeFactory)
        {
            _config = config ?? throw new ArgumentNullException(nameof(config));
            _scopeFactory = scopeFactory ?? throw new ArgumentNullException(nameof(scopeFactory));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
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
                queue: "order_deleted_queue",
                durable: true,
                exclusive: false,
                autoDelete: false
            );

            var consumer = new AsyncEventingBasicConsumer(channel);

            consumer.ReceivedAsync += async (model, ea) =>
            {
                try
                {
                    var body = ea.Body.ToArray();
                    var json = Encoding.UTF8.GetString(body);

                    var evento = JsonSerializer.Deserialize<OrderDeleteIntegrationEvent>(json);

                    if (evento != null)
                    {
                        using var scope = _scopeFactory.CreateScope();
                        var context = scope.ServiceProvider.GetRequiredService<DepotDbContext>();
                        var repository = scope.ServiceProvider.GetRequiredService<IDepotOrderRepository>();

                        var depotOrder = await repository.GetBySalesIdAsync(evento.OrderId);

                        // Validamos si la orden existe
                        if (depotOrder == null)
                        {
                            _logger.LogWarning("🚫 Orden con SalesOrderId {SalesOrderId} no encontrada en DepotService", evento.OrderId);
                            return;
                        }

                        _logger.LogInformation("🗑️ [DepotService] Procesando evento OrderDeletedIntegrationEvent para SalesOrderId {SalesOrderId}", evento.OrderId);

                        // Guardamos el estado de la orden antes de eliminarla
                        var statusHistory = new OrderStatusHistory
                        {
                            OrderId = depotOrder.DepotOrderId, 
                            OldStatus = depotOrder.Status,
                            NewStatus = OrderStatus.Deleted,
                            ChangedAt = DateTime.UtcNow,
                        };

                        await context.OrderStatusHistories.AddAsync(statusHistory);
                        await context.SaveChangesAsync();

                        // Eliminamos la orden del depósito
                        await repository.DeleteOrderByIdAsync(depotOrder.DepotOrderId);

                        // ✅ Guardamos los cambios en la base de datos
                        await context.SaveChangesAsync(stoppingToken);
                    }
                    else
                    {
                        _logger.LogWarning("📥 [DepotService] No se pudo deserializar el evento OrderIssuedIntegrationEvent");
                    }

                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "❌ Error al procesar el evento OrderIssuedIntegrationEvent");
                }

                await Task.Yield(); // mantener async
            };


            await channel.BasicConsumeAsync(queue: "order_deleted_queue", autoAck: true, consumer: consumer, stoppingToken);
            await Task.CompletedTask;
        }
    }
}
