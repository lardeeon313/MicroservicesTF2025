using AdminService.Domain.Entities;
using AdminService.Domain.Enums;
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

        public async Task<IEnumerable<Employee?>> GetEmployeesBySectorAsync(EmployeeSector sector)
        {
            return await _context.Employees
                .Where(e => e.Sector == sector)
                .ToListAsync();
        }

        public async Task<IEnumerable<Employee?>> GetEmployeesByStatusAsync(EmployeeStatus status)
        {
            return await _context.Employees
                .Where(e => e.Status == status)
                .ToListAsync();
        }

        public async Task UpdateEmployeeAsync(Employee employee)
        {
            _context.Employees.Update(employee);
            await _context.SaveChangesAsync();
        }
    }
}
