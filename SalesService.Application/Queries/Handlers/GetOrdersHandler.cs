using SalesService.Application.Queries;
using SalesService.Infrastructure.Persistence;
using SalesService.Domain.Entities;
using SalesService.Infraestructure;
using Microsoft.EntityFrameworkCore;

namespace SalesService.Application.Handlers
{
    public class GetOrdersHandler
    {
        private readonly SalesDbContext _context;

        public GetOrdersHandler(SalesDbContext context)
        {
            _context = context;
        }

        public async Task<List<Order>> HandleAsync(GetOrdersQuery query)
        {
            var q = _context.Orders
                .Include(o => o.Items)
                .Include(o => o.Customer)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(query.Status))
                q = q.Where(o => o.Status == query.Status);

            return await q.ToListAsync();
        }
    }
}

