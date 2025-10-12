using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using SalesService.Domain.Entities.OrderEntity;
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
    /// <summary>
    /// Consumidor para eventos de pedidos facturados.
    /// </summary>
    public class OrderInvoicedConsumer : BackgroundService
    {
        private readonly ILogger<OrderMissingConsumer> _logger;
        private readonly IConfiguration _config;
        private readonly IServiceScopeFactory _scopeFactory;

        public OrderInvoicedConsumer(ILogger<OrderMissingConsumer> logger, IConfiguration config, IServiceScopeFactory scopeFactory)
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
                queue: "order_invoiced_queue",
                durable: true,
                exclusive: false,
                autoDelete: false
            );

            var consumer = new AsyncEventingBasicConsumer(channel);

            consumer.ReceivedAsync += async (model, ea) =>
            {
                var json = Encoding.UTF8.GetString(ea.Body.ToArray());
                var evento = JsonSerializer.Deserialize<OrderInvoicedIntegrationEvent>(json);

                if (evento is not null)
                {
                    using var scope = _scopeFactory.CreateScope();
                    var context = scope.ServiceProvider.GetRequiredService<SalesDbContext>();
                    var repository = scope.ServiceProvider.GetRequiredService<IOrderRepository>();

                    try
                    {
<<<<<<< HEAD
                        var salesOrder = await repository.GetByIdAsync(evento.SalesOrderId);
=======
                        salesOrder.Status = OrderStatus.Invoiced;
                        salesOrder.TotalAmount = evento.TotalAmount;
                        await repository.UpdateAsync(salesOrder);
                        await context.SaveChangesAsync();
                        _logger.LogInformation($"Order {salesOrder.Id} is now in Invoiced.");
>>>>>>> origin/feature/santiago-microservicestf2025

                        if (salesOrder != null)
                        {
                            // 🔹 Actualizar estado de la orden
                            salesOrder.Status = OrderStatus.Invoiced;
                            salesOrder.TotalAmount = evento.TotalAmount;
                            salesOrder.ModifiedStatusDate = evento.InvoicedDate;

                            // 🔹 Actualizar items con los valores recibidos desde Depot
                            foreach (var itemEvento in evento.OrderItems)
                            {
                                var orderItem = salesOrder.Items
                                    .FirstOrDefault(i => i.Id == itemEvento.SalesOrderItemId);

                                if (orderItem != null)
                                {
                                    orderItem.PackagingType = itemEvento.PackagingType;
                                    orderItem.UnitPrice = itemEvento.UnitPrice;
                                    // Total es propiedad calculada => no hace falta setearlo
                                }
                                else
                                {
                                    // En caso de que Depot haya agregado ítems adicionales (poco común, pero seguro)
                                    salesOrder.Items.Add(new OrderItem
                                    {
                                        Id = itemEvento.SalesOrderItemId,
                                        ProductName = itemEvento.ProductName,
                                        ProductBrand = itemEvento.ProductBrand,
                                        Quantity = itemEvento.Quantity,
                                        PackagingType = itemEvento.PackagingType,
                                        UnitPrice = itemEvento.UnitPrice,
                                        OrderId = salesOrder.Id
                                    });
                                }
                            }
                            
                            await repository.UpdateAsync(salesOrder);
                            await context.SaveChangesAsync();

                            _logger.LogInformation("✅ Order {OrderId} updated as Invoiced with items.", salesOrder.Id);
                            
                            var statusHistory = new OrderStatusHistory
                            {
                                OrderId = salesOrder.Id,
                                OldStatus = OrderStatus.SentToBilling,
                                NewStatus = OrderStatus.Invoiced,
                                ChangedAt = evento.InvoicedDate
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
                    _logger.LogWarning("⚠️ Received an empty or invalid OrderInvoicedIntegrationEvent.");
                }
            };

            await channel.BasicConsumeAsync(
                queue: "order_invoiced_queue",
                autoAck: true,
                consumer: consumer
            );

            _logger.LogInformation("OrderInPreparationConsumer is running and listening for messages on 'order_invoiced_queue'.");

            await Task.CompletedTask;

        }
    }
}
