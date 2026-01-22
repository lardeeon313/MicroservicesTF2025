using AdminService.Application.DTOs.Employee;
using AdminService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using SalesService.Domain.Entities.OrderEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdminService.Application.Queries.Employee.GetAllEmployees
{
    public class GetAllEmployeesQueryHandler(IAdminRepository repository, ILogger<GetAllEmployeesQueryHandler> logger) : IGetAllEmployeesQueryHandler
    {
        private readonly ILogger<GetAllEmployeesQueryHandler> _logger = logger;
        private readonly IAdminRepository _repository = repository;

        /// <summary>
        /// Query para obtener todos los empleados.
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<EmployeeDto>> GetAllEmployeesAsync()
        {
            var employees = await _repository.GetAllAsync();
            if (!employees.Any())
            {
                _logger.LogWarning("No employees found.");
                return Enumerable.Empty<EmployeeDto>();
            }

            return employees.Select(e => new EmployeeDto
            {
                Id = e!.Id,
                UserName = e.UserName,
                FirstName = e.FirstName,
                LastName = e.LastName,                
                Email = e.Email,
                PhoneNumber = e.PhoneNumber,
                Role = e.Role,
                Sector = e.Sector,
                Status = e.Status,
                CreatedAt = e.CreatedAt
            }).ToList();
        }
    }
}
