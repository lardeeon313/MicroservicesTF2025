using LogisticService.Domain.Entities;
using LogisticService.Domain.Enums;
using LogisticService.Domain.IRepositories;
using LogisticService.Infraestructure.Persistence;
using LogisticService.Infraestructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client; // v7.1.2
using RabbitMQ.Client.Events;
using SharedKernel.IntegrationEvents.DepotEvents;
using System;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using static System.Collections.Specialized.BitVector32;

namespace LogisticService.Infraestructure.Messaging.Consumer
{
    public class OrderInvoicedConsumer : BackgroundService
    {
        private readonly ILogger<OrderInvoicedConsumer> _logger;
        private readonly IConfiguration _config;
        private readonly IServiceScopeFactory _scopeFactory;

        private IConnection? _connection;
        private IChannel? _channel;

        private const string EXCHANGE_NAME = "order_invoiced_exchange";
        private const string QUEUE_NAME = "logistic_order_invoiced_queue";

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

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    _connection = await factory.CreateConnectionAsync();
                    _channel = await _connection.CreateChannelAsync();
                    _logger.LogInformation("RabbitMQ connection established for LogisticService (OrderInvoicedConsumer).");
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to connect to RabbitMQ. Retrying in 5s...");
                    await Task.Delay(5000, stoppingToken);
                }
            }

            if (stoppingToken.IsCancellationRequested || _channel == null) return;

            await _channel.ExchangeDeclareAsync(
              exchange: EXCHANGE_NAME,
              type: ExchangeType.Fanout,
              durable: true,
              autoDelete: false
            );

            await _channel.QueueDeclareAsync(
              queue: QUEUE_NAME,
              durable: true,
              exclusive: false,
              autoDelete: false
            );

            await _channel.QueueBindAsync(
              queue: QUEUE_NAME,
              exchange: EXCHANGE_NAME,
              routingKey: ""
            );

            var consumer = new AsyncEventingBasicConsumer(_channel);

            consumer.ReceivedAsync += async (model, ea) =>
            {
                var json = Encoding.UTF8.GetString(ea.Body.ToArray());
                OrderInvoicedIntegrationEvent? evento = null;

                try
                {
                    evento = JsonSerializer.Deserialize<OrderInvoicedIntegrationEvent>(json);

                    if (evento is not null)
                    {
                        using var scope = _scopeFactory.CreateScope();
                        var context = scope.ServiceProvider.GetRequiredService<LogisticDbContext>();
                        var repository = scope.ServiceProvider.GetRequiredService<ILogisticOrderRepository>();
                        var nominatim = scope.ServiceProvider.GetRequiredService<INominatimService>();

                        // PASO 1: Customer
                        var customer = await context.Customers
                            .FirstOrDefaultAsync(c => c.Id == evento.CustomerId, stoppingToken);

                        if (customer == null)
                        {
                            customer = new LogisticCustomer { 
                                Id = evento.CustomerId,
                                FirstName = evento.CustomerName,
                                LastName = string.Empty,
                                Email = evento.CustomerEmail,
                                PhoneNumber = evento.PhoneNumber,
                                RegistrationDate = evento.RegistrationDate,
                            };
                            await context.Customers.AddAsync(customer, stoppingToken);
                            await context.SaveChangesAsync(stoppingToken);
                        }

                        var fullAddress =
    $"{evento.DeliveryAddress!.Street} {evento.DeliveryAddress.Number}, " +
    $"{evento.DeliveryAddress.City}, {evento.DeliveryAddress.Province}, {evento.DeliveryAddress.Country}";

                        (double? lat, double? lon, string? formatted) geoData;
                        bool geoValid = false;

                        try
                        {
                            geoData = await nominatim.GeocodeAddressAsync(fullAddress);
                            geoValid = geoData.lat != 0 && geoData.lon != 0;
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning(
                                ex,
                                "⚠️ Nominatim error for address {Address}. Saving order without coordinates.",
                                fullAddress
                            );

                            geoData = (null, null, null);
                        }

                        var address = new LogisticAddress
                        {
                            Street = evento.DeliveryAddress.Street,
                            Number = evento.DeliveryAddress.Number,
                            Apartment = evento.DeliveryAddress.Apartment,
                            City = evento.DeliveryAddress.City,
                            Province = evento.DeliveryAddress.Province,
                            Country = evento.DeliveryAddress.Country,
                            PostalCode = evento.DeliveryAddress.PostalCode,

                            FormattedAddress = geoData.formatted ?? fullAddress,

                            Latitude = geoValid ? geoData.lat : null,
                            Longitude = geoValid ? geoData.lon : null,

                            CreatedAt = DateTime.UtcNow
                        };

                        await context.Addresses.AddAsync(address, stoppingToken);
                        await context.SaveChangesAsync(stoppingToken);

                        // PASO 3: LogisticOrder
                        var logisticOrder = new LogisticOrder
                        {
                            SalesOrderId = evento.SalesOrderId,
                            DepotOrderId = evento.DepotOrderId,
                            CustomerId = customer.Id,
                            DeliveryAddressId = address.Id,
                            Status = OrderStatus.PendingVerification,
                            TotalAmount = evento.TotalAmount,
                            DeliveryDetail = evento.DeliveryDetail,
                            DeliveryDate = evento.DeliveryDate,
                            OrderDate = evento.OrderDate,
                            PaymentType = evento.PaymentType.HasValue ? (PaymentType)Enum.Parse(typeof(PaymentType), evento.PaymentType.Value.ToString()) : null,
                            Items = evento.OrderItems.Select(i => new LogisticOrderItem
                            {
                                SalesOrderItemId = i.SalesOrderItemId,
                                DepotOrderItemId = i.DepotOrderItemId, // Asegúrate que esta propiedad exista en tu entidad
                                ProductName = i.ProductName,
                                ProductBrand = i.ProductBrand,
                                Quantity = i.Quantity,
                                UnitPrice = i.UnitPrice,
                                PackagingType = i.PackagingType,
                                Total = i.Quantity * i.UnitPrice
                            }).ToList()
                        };
                        await context.LogisticOrders.AddAsync(logisticOrder, stoppingToken);
                        await context.SaveChangesAsync(stoppingToken);

                        _logger.LogInformation("✅ Logistic order created with SalesOrderId {SalesOrderId}", evento.SalesOrderId);
                        await _channel.BasicAckAsync(deliveryTag: ea.DeliveryTag, multiple: false);
                    }
                    else
                    {
                        _logger.LogWarning("⚠️ Received empty or invalid OrderInvoicedIntegrationEvent. Rejecting message.");
                        await _channel.BasicNackAsync(deliveryTag: ea.DeliveryTag, multiple: false, requeue: false);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "❌ Error creating logistic order from SalesOrderId {SalesOrderId}. Rejecting message.", evento?.SalesOrderId ?? 0);
                    await _channel.BasicNackAsync(deliveryTag: ea.DeliveryTag, multiple: false, requeue: false);
                }
            };

            await _channel.BasicConsumeAsync(
              queue: QUEUE_NAME,
              autoAck: false,
              consumer: consumer
            );

            _logger.LogInformation("LogisticService (OrderInvoicedConsumer) is running and waiting for messages on queue '{queueName}'.", QUEUE_NAME);

            try
            {
                await Task.Delay(Timeout.Infinite, stoppingToken);
            }
            catch (TaskCanceledException)
            {
                _logger.LogInformation("OrderInvoicedConsumer (Logistic) stopping.");
              }
            finally
            {
                if (_channel != null) await _channel.CloseAsync();
                if (_connection != null) await _connection.CloseAsync();
            }
        }
    }
}