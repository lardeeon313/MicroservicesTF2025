using AdminService.Domain.Entities;
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
        Task<IEnumerable<Employee?>> GetEmployeesByStatusAsync(int status);
        Task<Employee?> GetEmployeeByDniAsync(string dni);
        Task<Employee?> GetEmployeeByEmailAsync(string email);  
    }
}
