using IdentityService.Domain.Entities;
using IdentityService.Domain.Enums; // <--- IMPORTANTE: Asegúrate de tener este using para EmployedStatus
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using SharedKernel.IntegrationEvents;
using System;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace IdentityService.Infraestructure.Messaging.Consumer
{
    /// <summary>
    /// Consumidor de eventos para la actualización de empleados (usuarios).
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

                try
                {
                    var evento = JsonSerializer.Deserialize<EmployeeUpdatedIntegrationEvent>(json);

                    if (evento == null)
                    {
                        _logger.LogWarning("❌ Event invalid or null.");
                        return;
                    }

                    using var scope = _scopeFactory.CreateScope();
                    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
                    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

                    var user = await userManager.FindByIdAsync(evento.IdentityUserId);

                    if (user == null)
                    {
                        _logger.LogWarning("⚠ User not found Id={UserId}", evento.IdentityUserId);
                        return;
                    }

                    // --- Mapeo de propiedades ---
                    user.UserName = evento.UserName;
                    user.Name = evento.FirstName;
                    user.LastName = evento.LastName;
                    user.Email = evento.Email;
                    user.PhoneNumber = evento.PhoneNumber;

                    // --- CORRECCIÓN: CONVERSIÓN DE STRING A ENUM ---
                    // Intentamos convertir el string (ej: "Active") al Enum EmployedStatus
                    if (Enum.TryParse<EmployedStatus>(evento.Status, true, out var newStatus)) // 'true' ignora mayúsculas/minúsculas
                    {
                        user.Employed_Status = newStatus;
                    }
                    else
                    {
                        _logger.LogWarning($"⚠ El estado '{evento.Status}' recibido no coincide con ningún valor de EmployedStatus. Se omitió la actualización de estado.");
                    }

                    // --- 1. INTENTO DE ACTUALIZACIÓN DEL USUARIO ---
                    var updateResult = await userManager.UpdateAsync(user);

                    if (!updateResult.Succeeded)
                    {
                        var errors = string.Join(", ", updateResult.Errors.Select(e => e.Description));
                        _logger.LogError($"❌ Error actualizando usuario ID {user.Id}: {errors}");
                        return;
                    }

                    // --- 2. ACTUALIZACIÓN DE ROLES ---
                    var currentRoles = await userManager.GetRolesAsync(user);
                    var removeResult = await userManager.RemoveFromRolesAsync(user, currentRoles);

                    if (!removeResult.Succeeded)
                    {
                        _logger.LogWarning($"⚠ Advertencia al remover roles antiguos: {string.Join(", ", removeResult.Errors.Select(e => e.Description))}");
                    }

                    if (!await roleManager.RoleExistsAsync(evento.Role))
                    {
                        await roleManager.CreateAsync(new IdentityRole(evento.Role));
                    }

                    var addRoleResult = await userManager.AddToRoleAsync(user, evento.Role);

                    if (!addRoleResult.Succeeded)
                    {
                        var roleErrors = string.Join(", ", addRoleResult.Errors.Select(e => e.Description));
                        _logger.LogError($"❌ Error asignando el nuevo rol '{evento.Role}': {roleErrors}");
                    }
                    else
                    {
                        _logger.LogInformation("✅ User updated successfully (Status: {Status}). ID={UserId}", user.Employed_Status, user.Id);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "❌ Critical Error processing EmployeeUpdatedIntegrationEvent");
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