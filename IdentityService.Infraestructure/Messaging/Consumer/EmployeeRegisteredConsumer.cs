using IdentityService.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using SharedKernel.IntegrationEvents.AdminEvents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace IdentityService.Infraestructure.Messaging.Consumer
{
    public class EmployeeRegisteredConsumer : BackgroundService
    {
        private readonly ILogger<EmployeeRegisteredConsumer> _logger;
        private readonly IConfiguration _config;
        private readonly IServiceScopeFactory _scopeFactory;

        public EmployeeRegisteredConsumer(ILogger<EmployeeRegisteredConsumer> logger, IConfiguration config, IServiceScopeFactory scopeFactory)
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
                queue: "employee_registered_queue",
                durable: true,
                exclusive: false,
                autoDelete: false
            );

            var consumer = new AsyncEventingBasicConsumer(channel);

            consumer.ReceivedAsync += async (model, ea) =>
            {
                var json = Encoding.UTF8.GetString(ea.Body.ToArray());
                var evt = JsonSerializer.Deserialize<EmployeeRegisteredIntegrationEvent>(json);

                if (evt == null)
                {
                    _logger.LogWarning("⚠ Event invalid or null.");
                    return;
                }

                using var scope = _scopeFactory.CreateScope();
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

                try
                {
                    // 1️⃣ Crear usuario en Identity
                    var user = new ApplicationUser
                    {
                        UserName = evt.UserName,
                        Name = evt.FirstName,
                        LastName = evt.LastName,
                        Email = evt.Email,
                        HightDate = DateTime.UtcNow,
                        Employed_Status = IdentityService.Domain.Enums.EmployedStatus.Active,
                        MustCreatePassword = true 
                    };

                    // 2️⃣ Crear usuario SIN contraseña
                    var identityResult = await userManager.CreateAsync(user);

                    if (!identityResult.Succeeded)
                    {
                        var errors = string.Join(" | ", identityResult.Errors.Select(e => e.Description));
                        _logger.LogError("❌ Error creating user without password: {Errors}", errors);
                        return;
                    }

                    // 3️⃣ Crear rol si no existe
                    if (!await roleManager.RoleExistsAsync(evt.Role))
                        await roleManager.CreateAsync(new IdentityRole(evt.Role));

                    // 4️⃣ Asignar rol
                    await userManager.AddToRoleAsync(user, evt.Role);

                    _logger.LogInformation("✅ User created from AdminService. ID={UserId}", user.Id);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "❌ Error processing EmployeeRegisteredIntegrationEvent");
                }
            };

            await channel.BasicConsumeAsync(
                queue: "employee_registered_queue",
                autoAck: true,
                consumer: consumer
            );

            _logger.LogInformation("EmployeeRegisteredConsumer listening on 'employee_registered_queue'");
        }
    }
}
