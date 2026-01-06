using AdminService.Application.DTOs.Employee;
using AdminService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdminService.Application.Queries.Employees.GetEmployeesByStatus
{
    public class GetEmployeesByStatusQueryHandler(IAdminRepository repository, ILogger<GetEmployeesByStatusQueryHandler> logger) : IGetEmployeesByStatusQueryHandler
    {
        private readonly IAdminRepository _repository = repository;
        private readonly ILogger<GetEmployeesByStatusQueryHandler> _logger = logger;

        /// <summary>
        /// Query handler para obtener empleados por estado.
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>        
        public async Task<IEnumerable<EmployeeDto>> GetEmployeesByStatusAsync(GetEmployeesByStatusQuery query)
        {
            var employees = await _repository.GetEmployeesByStatusAsync(query.Status);
            if (employees == null || !employees.Any())
            {
                _logger.LogInformation("No se encontraron empleados con el estado especificado.");
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
                Status = e.Status,
                Sector = e.Sector,
                CreatedAt = e.CreatedAt,               
            });
        }
    }
}
