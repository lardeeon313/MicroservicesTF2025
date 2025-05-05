using Microsoft.EntityFrameworkCore;
using SalesService.Domain.Entities;
using SalesService.Domain.Entities.Order;
using SalesService.Domain.IRepositories;
using SalesService.Domain.Repositories;
using SalesService.Infraestructure;
using SalesService.Infrastructure.Persistence;

namespace SalesService.Infrastructure.Persistence.Repositories
{
    public class OrderItemRepository : IOrderItemRepository
    {
        private readonly SalesDbContext _context;

        public OrderItemRepository(SalesDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(OrderItem orderItem)
        {
            await _context.OrderItems.AddAsync(orderItem);
            await _context.SaveChangesAsync();
        }

        public async Task<OrderItem?> GetByIdAsync(Guid orderItemId)
        {
            return await _context.OrderItems
                .FirstOrDefaultAsync(oi => oi.Id == orderItemId);
        }

        public async Task<IEnumerable<OrderItem>> GetAllAsync()
        {
            return await _context.OrderItems.ToListAsync();
        }

        public async Task UpdateAsync(OrderItem orderItem)
        {
            _context.OrderItems.Update(orderItem);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid orderItemId)
        {
            var item = await _context.OrderItems.FindAsync(orderItemId);
            if (item != null)
            {
                _context.OrderItems.Remove(item);
                await _context.SaveChangesAsync();
            }
        }
    }
}
