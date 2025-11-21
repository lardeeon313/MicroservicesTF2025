using AdminService.Application.DTOs.Employee;
using AdminService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdminService.Application.Queries.Employees.GetEmployeeById
{
    public class GetEmployeeByIdQueryHandler(IAdminRepository repository, ILogger<GetEmployeeByIdQueryHandler> logger) : IGetEmployeeByIdQueryHandler
    {
        private readonly IAdminRepository _repository = repository;
        private readonly ILogger<GetEmployeeByIdQueryHandler> _logger = logger;

        /// <summary>
        /// Query para obtener un empleado por su ID.
        /// </summary>
        /// <returns></returns>
        async Task<EmployeeDto> IGetEmployeeByIdQueryHandler.GetEmployeeById(GetEmployeeByIdQuery query)
        {
            var employee = await _repository.GetEmployeeByIdAsync(query.EmployeeId);
            if (employee == null)
            {
                _logger.LogError("Empleado no encontrado por ID.");
                return new EmployeeDto();
            }

            return new EmployeeDto
            {
                Id = employee.Id,
                UserName =  employee.UserName,
                FirstName = employee.FirstName,
                LastName = employee.LastName,                
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
