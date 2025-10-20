using DepotService.Domain.Entities;
using DepotService.Domain.Enums;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
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

namespace DepotService.Infraestructure.Messaging.Consumers.LogisticConsumers
{
    public class OrderResolveIncidentConsumer : BackgroundService
    {
        private readonly ILogger<OrderResolveIncidentConsumer> _logger;
        private readonly IConfiguration _config;
        private readonly IServiceScopeFactory _scopeFactory;

        private IConnection? _connection;
        private IChannel? _channel;

        private const string EXCHANGE_NAME = "order_resolve_incident_exchange";
        private const string QUEUE_NAME = "depot_order_resolve_incident_queue";

        public OrderResolveIncidentConsumer(
            ILogger<OrderResolveIncidentConsumer> logger,
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
                    _logger.LogInformation("✅ Connected to RabbitMQ (ResolveIncidentConsumer).");
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
                OrderResolveIncidentIntegrationEvent? evento = null;

                try
                {
                    evento = JsonSerializer.Deserialize<OrderResolveIncidentIntegrationEvent>(json);

                    if (evento is not null)
                    {
                        using var scope = _scopeFactory.CreateScope();
                        var repository = scope.ServiceProvider.GetRequiredService<IDepotOrderRepository>();
                        var context = scope.ServiceProvider.GetRequiredService<DepotDbContext>();

                        var order = await repository.GetByIdAsync(evento.DepotOrderId);
                        if (order != null)
                        {
                            order.Status = OrderStatus.IncidentResolved;                            

                            await repository.UpdateOrderAsync(order);
                            await context.SaveChangesAsync();

                            var statusHistory = new OrderStatusHistory
                            {
                                OrderId = order.DepotOrderId,
                                OldStatus = OrderStatus.PendingIncidentResolution,
                                NewStatus = OrderStatus.IncidentResolved,
                                ChangedAt = evento.ResolveIncidentAt,
                            };

                            await context.OrderStatusHistories.AddAsync(statusHistory);
                            await context.SaveChangesAsync();

                            _logger.LogInformation("📦 Order {OrderId} marked as Resolve Incident.", order.DepotOrderId);
                            await _channel.BasicAckAsync(ea.DeliveryTag, multiple: false);
                        }
                        else
                        {
                            _logger.LogWarning("⚠️ Order not found: {OrderId}", evento.DepotOrderId);
                            await _channel.BasicNackAsync(ea.DeliveryTag, false, requeue: false);
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "❌ Error processing Resolve Incident order event {OrderId}", evento?.DepotOrderId ?? 0);
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
                _logger.LogInformation("OrderResolveIncidentConsumer stopping...");
            }
            finally
            {
                if (_channel != null) await _channel.CloseAsync();
                if (_connection != null) await _connection.CloseAsync();
            }
        }
    }
}
