using IdentityService.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
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

namespace IdentityService.Infraestructure.Messaging.Consumer
{
    /// <summary>
    /// Consumidor de eventos para el registro de usuarios.
    /// </summary>
    public class EmployeeUpdatedConsumer : BackgroundService
    {
        private readonly ILogger<EmployeeUpdatedConsumer> _logger;
        private readonly IConfiguration _config;
        private readonly IServiceScopeFactory _scopeFactory;

        public EmployeeUpdatedConsumer(ILogger<EmployeeUpdatedConsumer> logger, IConfiguration config, IServiceScopeFactory scopeFactory)
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
                queue: "employee_updated_queue",
                durable: true,
                exclusive: false,
                autoDelete: false
            );

            var consumer = new AsyncEventingBasicConsumer(channel);

            consumer.ReceivedAsync += async (model, ea) =>
            {
                var json = Encoding.UTF8.GetString(ea.Body.ToArray());

                var evento = JsonSerializer.Deserialize<EmployeeUpdatedIntegrationEvent>(json);

                if (evento == null)
                {
                    _logger.LogWarning("❌ Event invalid or null.");
                    return;
                }

                using var scope = _scopeFactory.CreateScope();
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

                try
                {
                    var user = await userManager.FindByIdAsync(evento.IdentityUserId);

                    if (user == null)
                    {
                        _logger.LogWarning("⚠ User not found Id={UserId}", evento.IdentityUserId);
                        return;
                    }

                    user.UserName = evento.UserName;
                    user.Name = evento.FirstName;
                    user.LastName = evento.LastName;
                    user.Email = evento.Email;

                    await userManager.UpdateAsync(user);

                    // Actualizamos el rol
                    var currentRoles = await userManager.GetRolesAsync(user);
                    await userManager.RemoveFromRolesAsync(user, currentRoles);

                    if (!await roleManager.RoleExistsAsync(evento.Role))
                        await roleManager.CreateAsync(new IdentityRole(evento.Role));

                    await userManager.AddToRoleAsync(user, evento.Role);

                    _logger.LogInformation("✅ User updated from AdminService. ID={UserId}", user.Id);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "❌ Error processing EmployeeUpdatedIntegrationEvent");
                }
            };

            await channel.BasicConsumeAsync(
                queue: "employee_updated_queue",
                autoAck: true,
                consumer: consumer
            );

            _logger.LogInformation("EmployeeUpdatedConsumer listening on 'employee_updated_queue'");
        }
    }
}

