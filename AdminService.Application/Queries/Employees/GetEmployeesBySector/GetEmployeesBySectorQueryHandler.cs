using AdminService.Application.DTOs.Employee;
using AdminService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdminService.Application.Queries.Employees.GetEmployeesBySector
{
    public class GetEmployeesBySectorQueryHandler(IAdminRepository repository, ILogger<GetEmployeesBySectorQueryHandler> logger) : IGetEmployeesBySectorQueryHandler
    {
        private IAdminRepository _repository = repository;
        private ILogger<GetEmployeesBySectorQueryHandler> _logger = logger;

        /// <summary>
        /// Query para obtener empleados por sector.
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>        
        public async Task<IEnumerable<EmployeeDto>> GetEmployeesBySectorAsync(GetEmployeesBySectorQuery query)
        {
            var employees = await _repository.GetEmployeesBySectorAsync(query.Sector);
            if (!employees.Any())
            {
                _logger.LogWarning("No employees found in sector {Sector}.", query.Sector);
                return Enumerable.Empty<EmployeeDto>();
            }

            return employees.Select(e => new EmployeeDto
            {
                Id = e.Id,
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
