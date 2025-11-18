using AdminService.Application.DTOs.Employee;
using AdminService.Application.Queries.Employee.GetEmployeeByDni;
using AdminService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdminService.Application.Queries.Employees.GetEmployeeByDni
{
    public class GetEmployeeByDniQueryHandler(IAdminRepository repository, ILogger<GetEmployeeByDniQueryHandler> logger) : IGetEmployeeByDniQueryHandler
    {
        private readonly IAdminRepository _repository = repository;
        private readonly ILogger<GetEmployeeByDniQueryHandler> _logger = logger;

        /// <summary>
        /// Query para obtener un empleado por su DNI.
        /// </summary>
        /// <returns></returns>
        async Task<EmployeeDto> IGetEmployeeByDniQueryHandler.GetEmployeeByDniAsync(GetEmployeeByDniQuery query)
        {
            var employee = await _repository.GetEmployeeByDniAsync(query.Dni);
            if (employee == null)
            {
                _logger.LogError("Empleado no encontrado por DNI.");
                return new EmployeeDto();
            }

            return new EmployeeDto
            {
                Id = employee.Id,
                UserName =  employee.UserName,
                FirstName = employee.FirstName,
                LastName = employee.LastName,
                Dni = employee.Dni,
                Email = employee.Email,
                PhoneNumber = employee.PhoneNumber,
                Role = employee.Role,
                Status = employee.Status,
                Sector = employee.Sector,
                CreatedAt = employee.CreatedAt,                
            };
        }
    }
}
