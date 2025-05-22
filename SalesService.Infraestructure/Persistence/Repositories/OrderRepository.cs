using Microsoft.EntityFrameworkCore;
using SalesService.Domain.Entities.OrderEntity;
using SalesService.Domain.Enums;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Infraestructure.Persistence.Repositories
{
    public class OrderRepository(SalesDbContext context) : IOrderRepository
    {
        private readonly SalesDbContext _context = context;

        public async Task AddAsync(Order order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
        }

        public Task AttachReceiptAsync(int orderId, string receiptBase64)
        {
            throw new NotImplementedException();
        }

        public Task DeleteAsync(Order order)
        {
            _context.Orders.Remove(order);
            return _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Order>> GetAllAsync()
        {
            return await _context.Orders
                .Include(o => o.Items)
                .ToListAsync();
        }

        public async Task<IEnumerable<Order>> GetByCustomerIdAsync(Guid customerId)
        {
            return await _context.Orders
                .Include(o => o.Items)
                .AsNoTracking()
                .Where(o => o.CustomerId == customerId)
                .ToListAsync();
        }

        public async Task<Order?> GetByIdAsync(int orderId)
        {
            return await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.Items)
                .AsNoTracking()
                .FirstOrDefaultAsync(o => o.Id == orderId);
        }

        public async Task<IEnumerable<Order>> GetByStatusAsync(string status)
        {
            if (!Enum.TryParse<OrderStatus>(status, true, out var parsedStatus))
                throw new ArgumentException($"Invalid status value: {status}");

            return await _context.Orders
                .Include(o => o.Items)
                .AsNoTracking()
                .Where(o => o.Status == parsedStatus)
                .ToListAsync();
        }

        public async Task<DateTime?> GetLastOrderDateByCustomerId(Guid customerId)
        {
            return await _context.Orders
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => (DateTime?)o.OrderDate)
                .FirstOrDefaultAsync();

        }

        public async Task<(List<Order> Orders, int TotalCount)> GetPagedAsync(int pageNumber, int pageSize, CancellationToken cancellationToken)
        {
            var query = _context.Orders
                .Include(o => o.Customer)
                .OrderByDescending(o => o.OrderDate);

            var totalCount = await query.CountAsync(cancellationToken);

            var orders = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            return (orders, totalCount);
        }

        public Task UpdateAsync(Order order)
        {
            _context.Orders.Update(order);
            return _context.SaveChangesAsync();
        }
    }
}
