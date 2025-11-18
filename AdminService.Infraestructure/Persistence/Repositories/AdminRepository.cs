using AdminService.Domain.Entities;
using AdminService.Domain.IRepositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdminService.Infraestructure.Persistence.Repositories
{
    public class AdminRepository : IAdminRepository
    {
        private readonly AdminDbContext _context;

        public AdminRepository(AdminDbContext context)
        {
            _context = context;
        }

        public async Task AddEmployeeAsync(Employee employee)
        {
            await _context.Employees.AddAsync(employee);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Employee?>> GetAllAsync()
        {
            return await _context.Employees                                
                .ToListAsync();
        }

        public async Task<Employee?> GetEmployeeByDniAsync(string dni)
        {
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.Dni == dni);
            return employee;
        }

        public async Task<Employee?> GetEmployeeByEmailAsync(string email)
        {
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.Email == email);
            return employee;
        }

        public async Task<Employee?> GetEmployeeByIdAsync(int id)
        {
            return await _context.Employees
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public Task<IEnumerable<Employee?>> GetEmployeesByStatusAsync(int status)
        {
            throw new NotImplementedException();
        }

        public async Task UpdateEmployeeAsync(Employee employee)
        {
            _context.Employees.Update(employee);
            await _context.SaveChangesAsync();
        }
    }
}
