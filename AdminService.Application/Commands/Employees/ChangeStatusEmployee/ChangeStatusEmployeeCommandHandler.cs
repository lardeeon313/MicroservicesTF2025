using AdminService.Domain.Enums;
using AdminService.Domain.IRepositories;
using AdminService.Infraestructure.Messaging.Publishers;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdminService.Application.Commands.Employees.ChangeStatusEmployee
{
    public class ChangeStatusEmployeeCommandHandler(IAdminRepository repository, IRabbitMQPublisher rabbitMQPublisher, ILogger<ChangeStatusEmployeeCommandHandler> logger) : IChangeStatusEmployeeCommandHandler
    {
        private IAdminRepository _repository = repository;
        private IRabbitMQPublisher _rabbitMQPublisher = rabbitMQPublisher;
        private ILogger<ChangeStatusEmployeeCommandHandler> _logger = logger;


        /// <summary>
        /// Handler para cambiar el estado de un empleado.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>        
        public async Task<bool> ChangeStatusEmployeeAsync(ChangeStatusEmployeeCommand command)
        {
            var employee = await _repository.GetEmployeeByIdAsync(command.EmployeeId);

            if (employee == null)
            {
                _logger.LogError("Empleado no encontrado.");
                return false;
            }

            // Validamos que el enum sea válido
            if (!Enum.IsDefined(typeof(EmployeeStatus), command.Status))
            {
                _logger.LogError($"Estado '{command.Status}' no es válido.");
                return false;
            }

            employee.Status = command.Status;
            employee.UpdatedAt = DateTime.UtcNow;

            await _repository.UpdateEmployeeAsync(employee);

            return true;

        }
    }
}
