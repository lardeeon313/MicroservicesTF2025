using AdminService.Domain.Entities;
using AdminService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdminService.Domain.IRepositories
{
    public interface IAdminRepository
    {
        Task AddEmployeeAsync(Employee employee);
        Task UpdateEmployeeAsync(Employee employee);
        Task<IEnumerable<Employee?>> GetAllAsync();
        Task<Employee?> GetEmployeeByIdAsync(int id);
        Task<IEnumerable<Employee?>> GetEmployeesByStatusAsync(EmployeeStatus status);
        Task<Employee?> GetEmployeeByDniAsync(string dni);
        Task<Employee?> GetEmployeeByEmailAsync(string email);
        Task<IEnumerable<Employee?>> GetEmployeesBySectorAsync(EmployeeSector sector);
    }
}
