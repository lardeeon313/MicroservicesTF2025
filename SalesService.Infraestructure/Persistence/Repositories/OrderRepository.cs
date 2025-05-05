using Microsoft.EntityFrameworkCore;
using SalesService.Domain.Entities;
using SalesService.Domain.Entities.Order;
using SalesService.Domain.Repositories;
using SalesService.Infraestructure;

namespace SalesService.Infraestructure.Persistence.Repositories
{
    public class OrderRepository (SalesDbContext context) : IOrderRepository
    {
        private readonly SalesDbContext _context = context;


        public async Task AddAsync(Order order)
        {
            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();
        }

        public async Task<Order?> GetByIdAsync(Guid orderId)
        {
            return await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == orderId);
        }

        public async Task<IEnumerable<Order>> GetAllAsync()
        {
            return await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.Items)
                .ToListAsync();
        }

        public async Task<IEnumerable<Order>> GetByStatusAsync(string status)
        {
            return await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.Items)
                .Where(o => o.Status.ToString() == status)
                .ToListAsync();
        }

        public async Task UpdateAsync(Order order)
        {
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
        }

        public async Task CancelAsync(Guid orderId)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order != null && order.Status != Domain.Enums.OrderStatus.Confirmed)
            {
                order.Status = Domain.Enums.OrderStatus.Canceled;
                order.ModifiedDate = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }

        public async Task AttachReceiptAsync(Guid orderId, string receiptBase64)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order != null)
            {
                order.PaymentReceipt = receiptBase64;
                order.ModifiedDate = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }
    }
}
