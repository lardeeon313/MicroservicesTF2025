using Microsoft.EntityFrameworkCore;
using SalesService.Domain.Entities;
using SalesService.Domain.IRepositories;
using SalesService.Infrastructure.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Infraestructure.Persistence.Repositories
{
    public class CustomerRepository(SalesDbContext context) : ICustomerRepository
    {
        private readonly SalesDbContext _context =context;
        public async Task AddAsync(Customer customer)
        {
            await _context.Customers.AddAsync(customer);
            await _context.SaveChangesAsync();

        }

        public async Task DeleteAsync(Guid customerId)
        {
            await _context.Customers
                .Where(c => c.Id == customerId)
                .ExecuteDeleteAsync();

        }

        public async Task<IEnumerable<Customer>> GetAllAsync() => 
            await _context.Customers.ToListAsync();

        public async Task GetByEmailAsync(string email)
        {
            await _context.Customers.FindAsync(email);


        }

        public async Task<Customer?> GetByIdAsync (Guid customerId)
        {
            return await _context.Customers.FindAsync(customerId);
        }

        public async Task UpdateAsync(Customer customer)
        {
            _context.Customers.Update(customer);
            await _context.SaveChangesAsync();
        }
    }

}
