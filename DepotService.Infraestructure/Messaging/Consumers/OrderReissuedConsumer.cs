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
                        .FirstOrDefaultAsync(o => o.SalesOrderId == evento.SalesOrderId);

                    var missingOrder = await context.DepotOrderMissings
                        .FirstOrDefaultAsync(o => o.SalesOrderId == evento.SalesOrderId);

                    if (order is not null && missingOrder is not null)
                    { 
                        missingOrder.DescriptionResolution = evento.ResolutionDescription;
                        await repository.UpdateMissingOrderAsync(missingOrder);
                        
                        order.Status = OrderStatus.ReReceived;
                        order.Items = evento.UpdateItems.Select(item => new DepotOrderItemEntity
                        {
                            Id = item.Id,
                            ProductName = item.ProductName,
                            Quantity = item.Quantity,
                            ProductBrand = item.ProductBrand,
                        }).ToList();
                        await repository.UpdateOrderAsync(order);


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
