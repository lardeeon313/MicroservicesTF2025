using AdminService.Domain.Entities;
using AdminService.Domain.IRepositories;
using AdminService.Infraestructure.Messaging.Publishers;
using DepotService.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SharedKernel.IntegrationEvents.AdminEvents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdminService.Application.Commands.Employees.RegisterEmployee
{
    public class RegisterEmployeeCommandHandler(IAdminRepository repository, IRabbitMQPublisher rabbitMQPublisher, ILogger<RegisterEmployeeCommandHandler> logger) : IRegisterEmployeeCommandHandler
    {
        private readonly ILogger<RegisterEmployeeCommandHandler> _logger = logger;
        private readonly IAdminRepository _repository = repository;
        private readonly IRabbitMQPublisher _rabbitMQPublisher = rabbitMQPublisher;

        /// <summary>
        /// Handler para registrar un nuevo empleado.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>        
        public async Task<bool> RegisterEmployeeAsync(RegisterEmployeeCommand command)
        {
            // Validamos duplicado de Email
            var emailExists = await _repository.GetEmployeeByEmailAsync(command.Email);
            if (emailExists != null)
            {
                _logger.LogError("El email ya pertenece a otro empleado.");
                return false;
            }

            var newEmployee = new Employee(
                command.UserName,
                command.FirstName,
                command.LastName,                
                command.Email,
                command.PhoneNumber,
                command.Role,
                command.Status,
                command.Sector,
                createdAt: DateTime.UtcNow
            );
            await _repository.AddEmployeeAsync(newEmployee);

            var integrationEvent = new EmployeeRegisteredIntegrationEvent
            {                
                UserName = command.UserName,
                FirstName = command.FirstName,
                LastName = command.LastName,
                Email = command.Email,
                Role = command.Role.ToString(),
                Status = command.Status.ToString(),
            };

            // Publicamos un evento de integración para notificar a IdentityService para que genere el usuario.
            await _rabbitMQPublisher.PublishAsync(integrationEvent, "employee_registered_queue");

            _logger.LogInformation($"Empleado {command.UserName} registrado con éxito.");
            return true;
            
        }
    }
}
