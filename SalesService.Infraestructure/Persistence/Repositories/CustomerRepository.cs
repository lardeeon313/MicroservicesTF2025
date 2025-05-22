using Microsoft.EntityFrameworkCore;
using SalesService.Domain.Entities.CustomerEntity;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Infraestructure.Persistence.Repositories
{
    public class CustomerRepository(SalesDbContext context) : ICustomerRepository
    {
        private readonly SalesDbContext _context = context;
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

        public async Task<IEnumerable<Customer>> GetAllAsync()
        {
            return await _context.Customers
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Customer?> GetByEmailAsync(string? email)
        {
             return await _context.Customers
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Email == email);
        }

        public async Task<Customer?> GetByIdAsync(Guid customerId)
        {
            return await _context.Customers
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == customerId);
        }

        public async Task UpdateAsync(Customer customer)
        {
            await _context.Customers
                .Where(c => c.Id == customer.Id)
                .ExecuteUpdateAsync(c => c
                    .SetProperty(c => c.FirstName, customer.FirstName)
                    .SetProperty(c => c.LastName, customer.LastName)
                    .SetProperty(c => c.Email, customer.Email)
                    .SetProperty(c => c.PhoneNumber, customer.PhoneNumber)
                    .SetProperty(c => c.Address, customer.Address));
        }

        public async Task<(List<Customer> Customers, int TotalCount)> GetPagedAsync(int pageNumber, int pageSize, CancellationToken cancellationToken)
        {
            var query = _context.Customers.OrderBy(c => c.FirstName);

            var totalCount = await query.CountAsync(cancellationToken);

            var customers = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            return (customers, totalCount);
        }
    }
}
