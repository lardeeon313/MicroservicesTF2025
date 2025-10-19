using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using SalesService.Domain.Entities.OrderEntity;
using SalesService.Domain.Enums;
using SalesService.Domain.IRepositories;
using SharedKernel.IntegrationEvents.LogisticEvents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace SalesService.Infraestructure.Messaging.Consumer.LogisticConsumers
{
    /// <summary>
    /// Consumidor para eventos de incidentes en la entrega de pedidos.
    /// </summary>
    public class OrderDeliveryIncidentConsumer : BackgroundService
    {
        private readonly ILogger<OrderDeliveryIncidentConsumer> _logger;
        private readonly IConfiguration _config;
        private readonly IServiceScopeFactory _scopeFactory;

        private IConnection? _connection;
        private IChannel? _channel;

        private const string EXCHANGE_NAME = "order_delivery_incident_exchange";
        private const string QUEUE_NAME = "sales_order_delivery_incident_queue";

        public OrderDeliveryIncidentConsumer(
            ILogger<OrderDeliveryIncidentConsumer> logger,
            IConfiguration config,
            IServiceScopeFactory scopeFactory)
        {
            _logger = logger;
            _config = config;
            _scopeFactory = scopeFactory;
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
                    _logger.LogInformation("✅ Connected to RabbitMQ (OrderDeliveryIncident).");
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "❌ Failed to connect to RabbitMQ. Retrying in 5s...");
                    await Task.Delay(5000, stoppingToken);
                }
            }

            if (_channel == null) return;

            await _channel.ExchangeDeclareAsync(EXCHANGE_NAME, ExchangeType.Fanout, durable: true, autoDelete: false);
            await _channel.QueueDeclareAsync(QUEUE_NAME, durable: true, exclusive: false, autoDelete: false);
            await _channel.QueueBindAsync(QUEUE_NAME, EXCHANGE_NAME, "");

            var consumer = new AsyncEventingBasicConsumer(_channel);

            consumer.ReceivedAsync += async (model, ea) =>
            {
                var json = Encoding.UTF8.GetString(ea.Body.ToArray());
                OrderDeliveryIncidentIntegrationEvent? evento = null;

                try
                {
                    evento = JsonSerializer.Deserialize<OrderDeliveryIncidentIntegrationEvent>(json);

                    if (evento is not null)
                    {
                        using var scope = _scopeFactory.CreateScope();
                        var repository = scope.ServiceProvider.GetRequiredService<IOrderRepository>();
                        var context = scope.ServiceProvider.GetRequiredService<SalesDbContext>();

                        var order = await repository.GetByIdAsync(evento.SalesOrderId);
                        if (order != null)
                        {
                            order.Status = OrderStatus.PendingIncidentResolution;
                            order.ModifiedStatusDate = evento.DeliveryIncidentAt;

                            await repository.UpdateAsync(order);
                            await context.SaveChangesAsync();

                            var statusHistory = new OrderStatusHistory
                            {
                                OrderId = order.Id,
                                OldStatus = OrderStatus.OnTheWay,
                                NewStatus = OrderStatus.PendingIncidentResolution,
                                ChangedAt = evento.DeliveryIncidentAt,
                            };

                            await context.OrderStatusHistories.AddAsync(statusHistory);
                            await context.SaveChangesAsync();

                            _logger.LogInformation("📦 Order {OrderId} marked as Delivered.", order.Id);
                            await _channel.BasicAckAsync(ea.DeliveryTag, multiple: false);
                        }
                        else
                        {
                            _logger.LogWarning("⚠️ Order not found: {OrderId}", evento.SalesOrderId);
                            await _channel.BasicNackAsync(ea.DeliveryTag, false, requeue: false);
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "❌ Error processing DeliveryIncident order event {OrderId}", evento?.SalesOrderId ?? 0);
                    await _channel.BasicNackAsync(ea.DeliveryTag, false, requeue: false);
                }
            };

            await _channel.BasicConsumeAsync(QUEUE_NAME, autoAck: false, consumer: consumer);
            _logger.LogInformation("🎧 Listening on queue {Queue}", QUEUE_NAME);

            try
            {
                await Task.Delay(Timeout.Infinite, stoppingToken);
            }
            catch (TaskCanceledException)
            {
                _logger.LogInformation("OrderDeliveryIncidentConsumer stopping...");
            }
            finally
            {
                if (_channel != null) await _channel.CloseAsync();
                if (_connection != null) await _connection.CloseAsync();
            }
        }
    }
}

