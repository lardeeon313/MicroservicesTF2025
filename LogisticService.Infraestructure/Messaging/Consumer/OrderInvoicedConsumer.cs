using LogisticService.Domain.Entities;
using LogisticService.Domain.Enums;
using LogisticService.Domain.IRepositories;
using LogisticService.Infraestructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using SharedKernel.IntegrationEvents.DepotEvents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace LogisticService.Infraestructure.Messaging.Consumer
{
    internal class OrderInvoicedConsumer : BackgroundService
    {
        private readonly ILogger<OrderInvoicedConsumer> _logger;
        private readonly IConfiguration _config;
        private readonly IServiceScopeFactory _scopeFactory;

        public OrderInvoicedConsumer(ILogger<OrderInvoicedConsumer> logger, IConfiguration config, IServiceScopeFactory scopeFactory)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _config = config ?? throw new ArgumentNullException(nameof(config));
            _scopeFactory = scopeFactory ?? throw new ArgumentNullException(nameof(scopeFactory));
        }

        /// <summary>
        /// Consumidor para procesar e instanciar la orden que ya ha sido facturada en Deposito - Lista para verificar.-
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

            await channel.QueueDeclareAsync("order_invoiced_queue", durable: true, exclusive: false, autoDelete: false);

            var consumer = new AsyncEventingBasicConsumer(channel);

            consumer.ReceivedAsync += async (model, ea) =>
            {
                var json = Encoding.UTF8.GetString(ea.Body.ToArray());
                var evento = JsonSerializer.Deserialize<OrderInvoicedIntegrationEvent>(json);

                if (evento is not null)
                {
                    using var scope = _scopeFactory.CreateScope();
                    var context = scope.ServiceProvider.GetRequiredService<LogisticDbContext>();
                    var repository = scope.ServiceProvider.GetRequiredService<ILogisticOrderRepository>();

                    try
                    {
                        var customer = await context.Customers
                            .FirstOrDefaultAsync(c => c.Id == evento.CustomerId);

                        if (customer == null)
                        {
                            customer = new LogisticCustomer
                            {
                                Id = evento.CustomerId,
                                FirstName = evento.CustomerName.Split(" ").First(),
                                LastName = evento.CustomerName.Split(" ").Last(),
                                Email = evento.CustomerEmail,
                                PhoneNumber = evento.PhoneNumber,
                                RegistrationDate = evento.RegistrationDate,
                            };
                            await context.Customers.AddAsync(customer);
                            await context.SaveChangesAsync();
                        }

                        // 2. Crear dirección de entrega
                        var address = new LogisticAddress
                        {
                            Street = evento.DeliveryAddress.Street,        
                            Number = evento.DeliveryAddress.Number,
                            Apartment = evento.DeliveryAddress.Apartment,
                            City = evento.DeliveryAddress.City,
                            Province = evento.DeliveryAddress.Province,
                            Country = evento.DeliveryAddress.Country,
                            PostalCode = evento.DeliveryAddress.PostalCode,
                            FormattedAddress = evento.DeliveryAddress.FormattedAddress,
                            Latitude = evento.DeliveryAddress.Latitude,
                            Longitude = evento.DeliveryAddress.Longitude,
                            CreatedAt = DateTime.UtcNow,
                        };
                        await context.Addresses.AddAsync(address);
                        await context.SaveChangesAsync();

                        // Crear nueva orden logística
                        var logisticOrder = new LogisticOrder
                        {
                            SalesOrderId = evento.SalesOrderId,
                            DepotOrderId = evento.DepotOrderId, 
                            CustomerId = customer.Id,
                            DeliveryAddressId = address.Id,
                            Status = OrderStatus.PendingVerification, 
                            TotalAmount = evento.TotalAmount,
                            DeliveryDate = evento.DeliveryDate,
                            OrderDate = evento.OrderDate,
                            PaymentType = evento.PaymentType.HasValue
                            ? (PaymentType)Enum.Parse(
                                typeof(PaymentType),
                                evento.PaymentType.Value.ToString()
                              )
                            : null,
                            Items = evento.OrderItems.Select(i => new LogisticOrderItem
                            {
                                SalesOrderItemId = i.SalesOrderItemId,
                                DepotOrderItemId = i.DepotOrderItemId,
                                ProductName = i.ProductName,
                                ProductBrand = i.ProductBrand,
                                Quantity = i.Quantity,
                                UnitPrice = i.UnitPrice,
                                PackagingType = i.PackagingType,
                                Total = i.Quantity * i.UnitPrice
                            }).ToList()
                        };

                        // Insertar en DB
                        await context.LogisticOrders.AddAsync(logisticOrder);
                        await context.SaveChangesAsync();

                        _logger.LogInformation("✅ Logistic order created with SalesOrderId {SalesOrderId}", evento.SalesOrderId);

                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "❌ Error creating logistic order from SalesOrderId {SalesOrderId}", evento.SalesOrderId);
                    }

                }
                else
                {
                    _logger.LogWarning("⚠️ Received empty or invalid OrderInvoicedIntegrationEvent.");
                }
            };

            await channel.BasicConsumeAsync(
                queue: "order_invoiced_queue",
                autoAck: true,
                consumer: consumer
            );

            _logger.LogInformation("OrderInvoicedConsumer is running and waiting for messages.");

            await Task.CompletedTask;
        }
    }
}
