using Microsoft.EntityFrameworkCore;
using SalesService.Domain.Entities;
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
                .Include(o => o.Addresses)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Customer?> GetByEmailAsync(string? email)
        {
            return await _context.Customers
               .Include(o => o.Addresses)
               .AsNoTracking()
               .FirstOrDefaultAsync(c => c.Email == email);
        }

        public async Task<Customer?> GetByIdAsync(Guid customerId)
        {
            return await _context.Customers
                .Include(o => o.Addresses)
                .Include(o => o.PaymentTypes)                    
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == customerId);
        }

        public async Task UpdateAsync(Customer customer)
        {
            _context.Customers.Update(customer);
            await _context.SaveChangesAsync();
        }

        public async Task<(List<Customer> Customers, int TotalCount)> GetPagedAsync(int pageNumber, int pageSize, CancellationToken cancellationToken)
        {
            var query = _context.Customers
                        .AsSplitQuery() 
                        .Include(c => c.Addresses)
                        .Include(c => c.PaymentTypes)
                        .OrderBy(c => c.FirstName);

            var totalCount = await query.CountAsync(cancellationToken);

            var customers = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            return (customers, totalCount);
        }

        public async Task<Customer?> GetByIdWithAddressesAsync(Guid id)
        {
            return await _context.Customers
                .Include(c => c.Addresses)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task RemoveAddress(Address address)
        {
            _context.Addresses.Remove(address);
            await _context.SaveChangesAsync();
        }

        public async Task<List<CustomerPaymentType>> GetPaymentTypesByCustomerIdAsync(Guid customerId)
        {
            return await _context.CustomerPaymentTypes
                .Where(pt => pt.CustomerId == customerId)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<bool> IsAddressReferencedInOrdersAsync(int addressId)
        {
            return await _context.Orders.AnyAsync(o => o.DeliveryAddressId == addressId);
        }
    }
}
