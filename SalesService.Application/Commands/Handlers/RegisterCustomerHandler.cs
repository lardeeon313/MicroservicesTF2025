using SalesService.Application.Commands;
using SalesService.Application.Exceptions;
using SalesService.Infrastructure.Persistence;
using SalesService.Domain.Entities;
using SalesService.Infraestructure;
using Microsoft.EntityFrameworkCore;

namespace SalesService.Application.Handlers
{
    public class RegisterCustomerHandler
    {
        private readonly SalesDbContext _context;

        public RegisterCustomerHandler(SalesDbContext context)
        {
            _context = context;
        }

        public async Task<Guid> HandleAsync(RegisterCustomerCommand cmd)
        {
            var exists = await _context.Customers.AnyAsync(c => c.Email == cmd.Email);
            if (exists)
                throw new ValidationException("Customer with this email already exists.");

            var customer = new Customer
            {
                Id = Guid.NewGuid(),
                FirstName = cmd.FirstName,
                LastName = cmd.LastName,
                Email = cmd.Email,
                Address = cmd.Address
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();
            return customer.Id;
        }
    }
}

