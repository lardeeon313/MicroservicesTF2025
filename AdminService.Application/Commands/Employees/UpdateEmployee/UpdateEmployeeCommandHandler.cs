using AdminService.Domain.Enums;
using AdminService.Domain.IRepositories;
using AdminService.Infraestructure.Messaging.Publishers;
using Microsoft.Extensions.Logging;
using SharedKernel.IntegrationEvents;
using SharedKernel.IntegrationEvents.AdminEvents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdminService.Application.Commands.Employees.UpdateEmployee
{
    public class UpdateEmployeeCommandHandler(IAdminRepository repository, IRabbitMQPublisher rabbitMQPublisher, ILogger<UpdateEmployeeCommandHandler> logger) : IUpdateEmployeeCommandHandler
    {
        private IAdminRepository _repository = repository;
        private ILogger<UpdateEmployeeCommandHandler> _logger = logger;
        private IRabbitMQPublisher _rabbitMQPublisher = rabbitMQPublisher;

        /// <summary>
        /// Handler para actualizar los datos de un empleado
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>        
        public async Task<bool> UpdateEmployeeAsync(UpdateEmployeeCommand command)
        {
            var employeeExists = await _repository.GetEmployeeByIdAsync(command.Id);

            if (employeeExists == null)
            {
                _logger.LogError("El empleado no existe.");
                return false;
            }

            // Validación de DNI duplicado
            var dniDuplicate = await _repository.GetEmployeeByDniAsync(command.Dni);
            if (dniDuplicate != null && dniDuplicate.Id != command.Id)
            {
                _logger.LogError($"El DNI {command.Dni} ya pertenece a otro empleado.");
                return false;
            }

            // Validación de Email duplicado
            var emailDuplicate = await _repository.GetEmployeeByEmailAsync(command.Email);
            if (emailDuplicate != null && emailDuplicate.Id != command.Id)
            {
                _logger.LogError($"El Email {command.Email} ya pertenece a otro empleado.");
                return false;
            }

            employeeExists.UserName = command.UserName;
            employeeExists.FirstName = command.FirstName;
            employeeExists.LastName = command.LastName;
            employeeExists.Email = command.Email;
            employeeExists.PhoneNumber = command.PhoneNumber;
            employeeExists.Dni = command.Dni;
            employeeExists.Status = command.Status;
            employeeExists.Sector = command.Sector;
            employeeExists.Role = command.Role;
            employeeExists.UpdatedAt = DateTime.UtcNow;

            await _repository.UpdateEmployeeAsync(employeeExists);

            // Publicamos evento de Actualización
            var integrationEvent = new EmployeeUpdatedIntegrationEvent
            {
                IdentityUserId = employeeExists.IdentityUserId,
                UserName = employeeExists.UserName,
                FirstName = employeeExists.FirstName,
                LastName = employeeExists.LastName,
                Email = employeeExists.Email,
                Role = employeeExists.Role.ToString(),
                Status = employeeExists.Status.ToString(),
            };

            await _rabbitMQPublisher.PublishAsync(integrationEvent, "employee_updated_queue");

            return true;
        }
    }
}

