using SalesService.Application.Queries;
using SalesService.Infrastructure.Persistence;
using SalesService.Domain.Entities;
using SalesService.Infraestructure;
using Microsoft.EntityFrameworkCore;

namespace SalesService.Application.Handlers
{
    public class GetOrderDetailHandler
    {
        private readonly SalesDbContext _context;

        public GetOrderDetailHandler(SalesDbContext context)
        {
            _context = context;
        }

        public async Task<Order?> HandleAsync(GetOrderDetailQuery query)
        {
            return await _context.Orders
                .Include(o => o.Items)
                .Include(o => o.Customer)
                .FirstOrDefaultAsync(o => o.Id == query.OrderId);
        }
    }
}

