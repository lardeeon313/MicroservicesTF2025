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
    /// Consumer para recibir eventos de órdenes emitidas desde RabbitMQ.
    /// </summary>
    public class OrderIssuedConsumer : BackgroundService
    {
        private readonly ILogger<OrderIssuedConsumer> _logger;
        private IConfiguration _config;
        private readonly IServiceScopeFactory _scopeFactory;

        public OrderIssuedConsumer(
            ILogger<OrderIssuedConsumer> logger,
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
                queue: "order_issued_queue",
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

                    var evento = JsonSerializer.Deserialize<OrderIssuedIntegrationEvent>(json);

                    if (evento != null)
                    {
                        using var scope = _scopeFactory.CreateScope();
                        var context = scope.ServiceProvider.GetRequiredService<DepotDbContext>();
                        var repository = scope.ServiceProvider.GetRequiredService<IDepotOrderRepository>();

                        var order = new DepotOrderEntity
                        {
                            SalesOrderId = evento.OrderId,
                            CustomerId = evento.CustomerId,
                            CustomerName = evento.CustomerName,
                            CustomerEmail = evento.CustomerEmail,
                            PhoneNumber = evento.PhoneNumber,
                            RegistrationDate = evento.RegistrationDate,
                            DeliveryDetail = evento.DeliveryDetail,         
                            DeliveryDate = evento.DeliveryDate,
                            OrderDate = evento.OrderDate,
                            Status = OrderStatus.Received,
                            PaymentType = evento.PaymentType.HasValue
                            ? (PaymentType)Enum.Parse(
                                typeof(PaymentType),
                                evento.PaymentType.Value.ToString()
                              )
                            : null,
                            DeliveryAddress = new OrderAddress
                            {
                                Street = evento.DeliveryAddress.Street,
                                Number = evento.DeliveryAddress.Number,
                                Apartment = evento.DeliveryAddress.Apartment,
                                City = evento.DeliveryAddress.City,
                                Province = evento.DeliveryAddress.Province,
                                Country = evento.DeliveryAddress.Country,
                                PostalCode = evento.DeliveryAddress.PostalCode,
                                Latitude = evento.DeliveryAddress.Latitude,
                                Longitude = evento.DeliveryAddress.Longitude,
                                FormattedAddress = evento.DeliveryAddress.FormattedAddress
                            },
                            Items = evento.Items.Select(item => new DepotOrderItemEntity
                            {
                                SalesOrderItemId = item.Id,
                                ProductName = item.ProductName,
                                ProductBrand = item.ProductBrand,
                                Quantity = item.Quantity
                            }).ToList()
                        };

                        // ✅ Primero guardamos la orden
                        await repository.AddAsync(order);
                        await context.SaveChangesAsync(stoppingToken);

                        // ✅ Luego guardamos el historial de estatus
                        var statusHistory = new OrderStatusHistory
                        {
                            OrderId = order.DepotOrderId, // Usa el ID real ya guardado
                            OldStatus = OrderStatus.Issued,
                            NewStatus = OrderStatus.Received,
                            ChangedAt = DateTime.UtcNow,
                        };

                        await context.OrderStatusHistories.AddAsync(statusHistory);
                        await context.SaveChangesAsync();


                        _logger.LogInformation("📦 Orden recibida y guardada en DepotService: {OrderId}", order.DepotOrderId);
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

            await channel.BasicConsumeAsync(queue: "order_issued_queue", autoAck: true, consumer: consumer, stoppingToken);
            await Task.CompletedTask;
        }
    }
}
