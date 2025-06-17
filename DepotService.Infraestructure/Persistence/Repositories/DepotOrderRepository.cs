using DepotService.Domain.Entities;
using DepotService.Domain.Enums;
using DepotService.Domain.IRepositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Infraestructure.Persistence.Repositories
{
    public class DepotOrderRepository : IDepotOrderRepository
    {
        private readonly DepotDbContext _context;

        public DepotOrderRepository(DepotDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(DepotOrderEntity order)
        {
            await _context.DepotOrders.AddAsync(order);
        }

        public async Task<DepotOrderEntity?> GetByIdAsync(int depotOrderId)
        {
            return await _context.DepotOrders.FindAsync(depotOrderId);
        }

        public async Task<IEnumerable<DepotOrderEntity?>> GetAllAsync()
        {
            return await _context.DepotOrders
                .Include(x => x.Items)
                .ToListAsync();
        }

        public async Task UpdateOrderAsync(DepotOrderEntity order)
        {
            _context.DepotOrders.Update(order);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<DepotOrderEntity>> GetOrderByStatusAsync(string status)
        {
            if (!Enum.TryParse<OrderStatus>(status, true, out var parsedStatus))
                throw new ArgumentException($"Invalid status value: {status}");

            return await _context.DepotOrders
                .Include(o => o.Items)
                .AsNoTracking()
                .Where(o => o.Status == parsedStatus)
                .ToListAsync();
        }

        public async Task<IEnumerable<DepotOrderMissing>> GetMissingOrdersAsync()
        {
            return await _context.DepotOrderMissings
                .Include(m => m.MissingItems)
                .ToListAsync();
        }

        public async Task<DepotOrderMissing?> GetMissingOrderByIdAsync(int missingId)
        {
            return await _context.DepotOrderMissings
                .Include(m => m.MissingItems)
                .FirstOrDefaultAsync(m => m.MissingId == missingId);
        }

        public async Task AddMissingOrderAsync(DepotOrderMissing missingOrder)
        {
            await _context.DepotOrderMissings.AddAsync(missingOrder);
        }

        public async Task UpdateMissingOrderAsync(DepotOrderMissing missingOrder)
        {
            _context.DepotOrderMissings.Update(missingOrder);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<DepotOrderEntity>> GetAllByOperatorIdAsync(Guid operatorId)
        {
            return await _context.DepotOrders
                .Include(o => o.Items)
                .Include(o => o.Missings)
                .Where(o => o.AssignedOperatorId == operatorId &&
                        (o.Status == OrderStatus.Assigned || o.Status == OrderStatus.ReReceived))
                .ToListAsync();
        }

        public async Task AddMissing(DepotOrderMissing missingOrder)
        {
            await _context.DepotOrderMissings.AddAsync(missingOrder);
            await _context.SaveChangesAsync();

        }

        public async Task<List<DepotOrderItemEntity>> GetOrderItemsByIdsAsync(List<int> ids)
        {
            return await _context.DepotOrderItems
                .Where(item => ids.Contains(item.Id))
                .ToListAsync();
        }

        public async Task UpdateDepotOrderItemsAsync(List<DepotOrderItemEntity> items)
        {
            foreach (var item in items)
            {
                _context.DepotOrderItems.Update(item);
            }
            await _context.SaveChangesAsync();
        }

        public Task<List<DepotOrderEntity>> GetAssignedPendingOrdersByOperatorIdAsync()
        {
            return _context.DepotOrders
                .Include(o => o.Items)
                .Where(o => o.AssignedOperatorId != null &&
                            (o.Status == OrderStatus.Assigned || o.Status == OrderStatus.ReReceived))
                .ToListAsync();
        }
    }
}
