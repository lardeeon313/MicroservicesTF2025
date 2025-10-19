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
using System.Threading; // Añadido
using System.Threading.Channels;
using System.Threading.Tasks;

// Asegúrate de tener el DbContext correcto si no está en este namespace
// using SalesService.Infraestructure.Persistence; 

namespace SalesService.Infraestructure.Messaging.Consumer
{
    /// <summary>
    /// Consumidor para eventos de pedidos facturados.
    /// </summary>
    public class OrderInvoicedConsumer : BackgroundService
    {
        // --- CAMBIO 1: Corregir el tipo de Logger ---
        private readonly ILogger<OrderInvoicedConsumer> _logger;
        private readonly IConfiguration _config;
        private readonly IServiceScopeFactory _scopeFactory;

        // --- CAMBIO 2: Añadir campos para conexión y canal (nullable) ---
        private IConnection? _connection;
        private IChannel? _channel;

        // --- CAMBIO 3: Definir nombres para el Exchange y la Cola ÚNICA ---
        private const string EXCHANGE_NAME = "order_invoiced_exchange";
        private const string QUEUE_NAME = "sales_order_invoiced_queue"; // ¡Cola única para Sales!

        public OrderInvoicedConsumer(ILogger<OrderInvoicedConsumer> logger, IConfiguration config, IServiceScopeFactory scopeFactory)
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

            // --- CAMBIO 4: Añadir bucle de reintento de conexión ---
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    _connection = await factory.CreateConnectionAsync();
                    _channel = await _connection.CreateChannelAsync();
                    _logger.LogInformation("RabbitMQ connection established for SalesService (OrderInvoicedConsumer).");
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to connect to RabbitMQ. Retrying in 5s...");
                    await Task.Delay(5000, stoppingToken);
                }
            }

            if (stoppingToken.IsCancellationRequested || _channel == null) return;


            // --- CAMBIO 5: Declarar el Exchange, declarar la Cola ÚNICA y BINDEAR ---
            await _channel.ExchangeDeclareAsync(
                exchange: EXCHANGE_NAME,
                type: ExchangeType.Fanout, // Debe coincidir con el publicador
                durable: true,
                autoDelete: false
            );

            await _channel.QueueDeclareAsync(
              queue: QUEUE_NAME, // Usar la cola única
                      durable: true,
              exclusive: false,
              autoDelete: false
            );

            await _channel.QueueBindAsync(
                queue: QUEUE_NAME,
                exchange: EXCHANGE_NAME,
                routingKey: "" // Fanout ignora el routing key
            );
            // --- Fin del cambio 5 ---

            var consumer = new AsyncEventingBasicConsumer(_channel);

            consumer.ReceivedAsync += async (model, ea) =>
            {
                var json = Encoding.UTF8.GetString(ea.Body.ToArray());
                OrderInvoicedIntegrationEvent? evento = null; // Marcar como nullable

                try
                {
                    evento = JsonSerializer.Deserialize<OrderInvoicedIntegrationEvent>(json);
                    if (evento is not null)
                    {
                        using var scope = _scopeFactory.CreateScope();
                        var context = scope.ServiceProvider.GetRequiredService<SalesDbContext>();
                        var repository = scope.ServiceProvider.GetRequiredService<IOrderRepository>();


                        var salesOrder = await repository.GetByIdAsync(evento.SalesOrderId);

                        salesOrder.Status = OrderStatus.Invoiced;
                        salesOrder.TotalAmount = evento.TotalAmount;
                        await repository.UpdateAsync(salesOrder);
                        await context.SaveChangesAsync();
                        _logger.LogInformation($"Order {salesOrder.Id} is now in Invoiced.");

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
                                }
                                else
                                {
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
                            await context.SaveChangesAsync(); // Primer SaveChanges

                            _logger.LogInformation("✅ Order {OrderId} updated as Invoiced with items.", salesOrder.Id);

                            var statusHistory = new OrderStatusHistory
                            {
                                OrderId = salesOrder.Id,
                                OldStatus = OrderStatus.SentToBilling,
                                NewStatus = OrderStatus.Invoiced,
                                ChangedAt = evento.InvoicedDate
                            };

                            await context.OrderStatusHistories.AddAsync(statusHistory);
                            await context.SaveChangesAsync(); // Segundo SaveChanges

                            // --- CAMBIO 6: Confirmar el mensaje (ACK) ---
                            await _channel.BasicAckAsync(deliveryTag: ea.DeliveryTag, multiple: false);
                        }
                        else
                        {
                            _logger.LogWarning("⚠️ Order with ID {SalesOrderId} not found.", evento.SalesOrderId);
                            // --- CAMBIO 7: Rechazar el mensaje (NACK) ---
                            await _channel.BasicNackAsync(deliveryTag: ea.DeliveryTag, multiple: false, requeue: false);
                        }

                    }
                    else
                    {
                        _logger.LogWarning("⚠️ Received an empty or invalid OrderInvoicedIntegrationEvent.");
                        // --- CAMBIO 7: Rechazar el mensaje (NACK) ---
                        await _channel.BasicNackAsync(deliveryTag: ea.DeliveryTag, multiple: false, requeue: false);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "❌ Error updating sales order from event {SalesOrderId}", evento?.SalesOrderId ?? 0);
                    // --- CAMBIO 7: Rechazar el mensaje (NACK) ---
                    await _channel.BasicNackAsync(deliveryTag: ea.DeliveryTag, multiple: false, requeue: false);
                }
            };

            await _channel.BasicConsumeAsync(
              queue: QUEUE_NAME,
              autoAck: false,
               consumer: consumer);
            _logger.LogInformation("SalesService (OrderInvoicedConsumer) is running and listening on queue '{queueName}'.", QUEUE_NAME);

            // --- CAMBIO 8: Reemplazar Task.CompletedTask para MANTENER VIVO el servicio ---
            try
            {
                await Task.Delay(Timeout.Infinite, stoppingToken);
            }
            catch (TaskCanceledException)
            {
                _logger.LogInformation("OrderInvoicedConsumer (Sales) stopping.");
            }
            finally
            {
                if (_channel != null) await _channel.CloseAsync();
                if (_connection != null) await _connection.CloseAsync();
            }
        }
    }
}