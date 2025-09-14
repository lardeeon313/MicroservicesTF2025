using DepotService.Domain.Entities;
using DepotService.Domain.Enums;
using DepotService.Domain.IRepositories;
using Microsoft.EntityFrameworkCore;
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

namespace DepotService.Infraestructure.Messaging.Consumers
{
    public class OrderReissuedConsumer : BackgroundService
    {
        private readonly ILogger<OrderReissuedConsumer> _logger;
        private readonly IConfiguration _config;
        private readonly IServiceScopeFactory _scopeFactory;

        public OrderReissuedConsumer(ILogger<OrderReissuedConsumer> logger, IConfiguration config, IServiceScopeFactory scopeFactory)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _config = config ?? throw new ArgumentNullException(nameof(config));
            _scopeFactory = scopeFactory ?? throw new ArgumentNullException(nameof(scopeFactory));
        }

        /// <summary>
        ///  Consumidor para procesar eventos de reemisión de órdenes.
        /// </summary>
        /// <param name="stoppingToken"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
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

            await channel.QueueDeclareAsync("order_reissued_queue", durable: true, exclusive: false, autoDelete: false);

            var consumer = new AsyncEventingBasicConsumer(channel);
            consumer.ReceivedAsync += async (model, ea) =>
            {
                var json = Encoding.UTF8.GetString(ea.Body.ToArray());
                var evento = JsonSerializer.Deserialize<OrderReissuedIntegrationEvent>(json);

                if (evento is not null)
                {
                    using var scope = _scopeFactory.CreateScope();
                    var context = scope.ServiceProvider.GetRequiredService<DepotDbContext>();
                    var repository = scope.ServiceProvider.GetRequiredService<IDepotOrderRepository>();

                    var order = await context.DepotOrders
                        .Include(o => o.Items)
                        .FirstOrDefaultAsync(o => o.SalesOrderId == evento.SalesOrderId);


                    var missingOrder = await context.DepotOrderMissings
                        .Include(o => o.MissingItems)
                        .FirstOrDefaultAsync(o => o.SalesOrderId == evento.SalesOrderId);

                    if (order is not null && missingOrder is not null)
                    {
                        // Actualizar la descripción de la resolución en el reporte de faltantes.
                        missingOrder.DescriptionResolution = evento.ResolutionDescription;
                        await repository.UpdateMissingOrderAsync(missingOrder);

                        // --- LÓGICA DE ACTUALIZACIÓN DE ÍTEMS CORREGIDA ---
                        var existingItems = order.Items.ToList();
                        var updatedItems = new List<DepotOrderItemEntity>();

                        foreach (var itemDto in evento.UpdateItems)
                        {
                            // 1. Buscamos el ítem por su SalesOrderItemId.
                            // Asumo que el SalesOrderItemId es la clave que vincula los ítems entre ambos servicios.
                            var existingItem = existingItems
                                .FirstOrDefault(i => i.SalesOrderItemId == itemDto.Id);

                            if (existingItem != null)
                            {
                                // 2. Si el ítem existe, lo actualizamos.
                                existingItem.ProductName = itemDto.ProductName;
                                existingItem.ProductBrand = itemDto.ProductBrand;
                                existingItem.Quantity = itemDto.Quantity;
                                updatedItems.Add(existingItem);
                                existingItems.Remove(existingItem); // Removemos el ítem para luego identificar los eliminados
                            }
                            else
                            {
                                // 3. Si el ítem no existe, creamos uno nuevo.
                                var newItem = new DepotOrderItemEntity
                                {
                                    SalesOrderItemId = itemDto.Id, // Usamos el ID de SalesService como referencia
                                    ProductName = itemDto.ProductName,
                                    ProductBrand = itemDto.ProductBrand,
                                    Quantity = itemDto.Quantity,
                                    DepotOrderEntityId = order.DepotOrderId
                                };
                                updatedItems.Add(newItem);
                            }
                        }

                        // 4. Eliminamos los ítems que ya no están en la lista del evento
                        // Los ítems restantes en 'existingItems' son los que deben ser eliminados.
                        foreach (var itemToDelete in existingItems)
                        {
                            context.DepotOrderItems.Remove(itemToDelete);
                        }

                        // 5. Actualizamos la lista de ítems de la orden con la lista corregida.
                        order.Items = updatedItems;
                        // --- FIN DE LA LÓGICA DE ACTUALIZACIÓN DE ÍTEMS ---

                        order.Status = OrderStatus.ReReceived;
                        order.AssignedOperatorId = null; // Limpiamos la asignación
                        order.DeliveryDate = evento.DeliveryDate;

                        await repository.UpdateOrderAsync(order);
                        await context.SaveChangesAsync();

                        // Guardar el historial de estado
                        var statusHistory = new OrderStatusHistory
                        {
                            OrderId = order.DepotOrderId,
                            OldStatus = OrderStatus.PendingResolution,
                            NewStatus = OrderStatus.ReReceived,
                            ChangedAt = DateTime.UtcNow
                        };
                        await context.OrderStatusHistories.AddAsync(statusHistory);

                        await context.SaveChangesAsync();
                        _logger.LogInformation($"Order reissued successfully for SalesOrderId: {evento.SalesOrderId}.");
                    }
                }
            };

            await channel.BasicConsumeAsync("order_reissued_queue", autoAck: true, consumer: consumer);
            await Task.CompletedTask;
        }
    }
}
