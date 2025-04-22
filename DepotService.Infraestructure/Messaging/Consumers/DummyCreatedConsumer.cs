using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using SharedKernel.IntegrationEvents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace DepotService.Infraestructure.Messaging.Consumers
{
    public class DummyCreatedConsumer : BackgroundService
    {
        // Private readonly IServiceScopeFactory scopeFactory = _scopeFactory
        private readonly ILogger _logger;
        private readonly IConfiguration _config; 

        public DummyCreatedConsumer(ILogger<DummyCreatedConsumer> logger, IConfiguration config)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _config = config ?? throw new ArgumentNullException(nameof(config));
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
            queue: "dummy_created_queue",
            durable: false,
            exclusive: false,
            autoDelete: false
            );

            var consumer = new AsyncEventingBasicConsumer(channel);

            consumer.ReceivedAsync += async (model, ea) =>
            {
                var body = ea.Body.ToArray();
                var json = Encoding.UTF8.GetString(body);

                var evento = JsonSerializer.Deserialize<DummyCreatedIntegrationEvent>(json);

            // Forma de Persistir los datos en el microservicio que recibe, a traves de "_ScopeFactory"
                /*if (evento != null)
            {
                using var scope = _scopeFactory.CreateScope();
                var repo = scope.ServiceProvider.GetRequiredService<IDummyRepository>();

                var dummy = new DepotService.Domain.Entities.Dummy
                {
                    Id = evento.Id,
                    Nombre = evento.Nombre,
                    FechaCreacion = evento.FechaCreacion
                };

                await repo.AddAsync(dummy);
                _logger.LogInformation("📝 Dummy guardado en DepotService: {Nombre}", dummy.Nombre);
            }*/

                _logger.LogInformation("📥 [DepotService] Dummy recibido:");
                _logger.LogInformation("🔹 Id: {Id}", evento?.Id);
                _logger.LogInformation("🔹 Nombre: {Nombre}", evento?.Nombre);
                _logger.LogInformation("🔹 Fecha: {Fecha}", evento?.FechaCreacion);

                await Task.Yield(); // mantener async
            };

            await channel.BasicConsumeAsync(queue: "dummy_created_queue", autoAck: true, consumer: consumer);

            await Task.CompletedTask;

        }
    }
}
