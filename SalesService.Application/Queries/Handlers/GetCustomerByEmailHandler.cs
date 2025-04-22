using SalesService.Application.Queries;
using SalesService.Infrastructure.Persistence;
using SalesService.Domain.Entities;
using SalesService.Infraestructure;
using Microsoft.EntityFrameworkCore;

namespace SalesService.Application.Handlers
{
    public class GetCustomerByEmailHandler
    {
        private readonly SalesDbContext _context;

        public GetCustomerByEmailHandler(SalesDbContext context)
        {
            _context = context;
        }

        public async Task<Customer?> HandleAsync(GetCustomerByEmailQuery query)
        {
            return await _context.Customers
                .FirstOrDefaultAsync(c => c.Email == query.Email);
        }
    }
}
