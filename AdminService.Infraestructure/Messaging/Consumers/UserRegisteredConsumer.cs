using AdminService.Domain.Entities;
using AdminService.Domain.Enums;
using AdminService.Domain.IRepositories;
using AdminService.Infraestructure.Persistence;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using SalesService.Domain.Entities.OrderEntity;
using SharedKernel.IntegrationEvents.IdentityEvents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace AdminService.Infraestructure.Messaging.Consumers
{
    /// <summary>
    /// Consumidor de eventos para el registro de usuarios.
    /// </summary>
    public class UserRegisteredConsumer : BackgroundService
    {
        private readonly ILogger<UserRegisteredConsumer> _logger;
        private readonly IConfiguration _config;
        private readonly IServiceScopeFactory _scopeFactory;

        public UserRegisteredConsumer(ILogger<UserRegisteredConsumer> logger, IConfiguration config, IServiceScopeFactory scopeFactory)
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
                queue: "identity_user_registered_queue",
                durable: true,
                exclusive: false,
                autoDelete: false
            );

            var consumer = new AsyncEventingBasicConsumer(channel);

            consumer.ReceivedAsync += async (model, ea) =>
            {
                var json = Encoding.UTF8.GetString(ea.Body.ToArray());
                var evento = JsonSerializer.Deserialize<UserRegisteredIntegrationEvent>(json);

                if (evento is not null)
                {
                    using var scope = _scopeFactory.CreateScope();
                    var context = scope.ServiceProvider.GetRequiredService<AdminDbContext>();
                    var repository = scope.ServiceProvider.GetRequiredService<IAdminRepository>();

                    try
                    {
                        var employee = new Employee
                        {
                            IdentityUserId = evento.UserIdentityId,
                            UserName = evento.UserName,
                            FirstName = evento.FirstName,
                            LastName = evento.LastName,                            
                            PhoneNumber = evento.PhoneNumber,
                            Email = evento.Email,
                            CreatedAt = evento.CreateAt,
                            Status = Domain.Enums.EmployeeStatus.Active,                            
                            Role = Enum.TryParse<EmployeeRole>(evento.Role, true, out var parsedRole)
                                    ? parsedRole
                                    : EmployeeRole.Admin                            

                        };

                        await repository.AddEmployeeAsync(employee);
                        await context.SaveChangesAsync();

                        _logger.LogInformation("📦 Usuario recibido y guardado en AdminService: {UserIdentity}", employee.Id);

                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "❌ Error user register from event.");
                    }
                }
                else
                {
                    _logger.LogWarning("⚠️ Received an empty or invalid UserRegisteredIntegrationEvent.");
                }
            };

            await channel.BasicConsumeAsync(
                queue: "identity_user_registered_queue",
                autoAck: true,
                consumer: consumer
            );

            _logger.LogInformation("UserRegisteredConsumer is running and listening for messages on 'identity_user_registered_queue'.");

            await Task.CompletedTask;

        }
    }
}

