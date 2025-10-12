using LogisticService.Domain.Entities;
using LogisticService.Domain.Enums;
using LogisticService.Domain.IRepositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Infraestructure.Persistence.Repositories
{
    public class LogisticOrderRepository : ILogisticOrderRepository
    {
        private readonly LogisticDbContext _context;
        public LogisticOrderRepository(LogisticDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(LogisticOrder order)
        {
            await _context.LogisticOrders.AddAsync(order);
            await _context.SaveChangesAsync();
        }

        public async Task AddStatusHistoryAsync(OrderStatusHistory statusHistory)
        {
            await _context.OrderStatusHistories.AddAsync(statusHistory);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<LogisticOrder>> GetAllAsync()
        {
            return await _context.LogisticOrders
                .Include(o => o.Customer)
                .Include(o => o.Items)
                .Include(o => o.AssignedDeliveryTeam)
                .Include(o => o.AssignedDeliveryZone)
                .Include(o => o.DeliveryAddress)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<LogisticOrder?> GetByIdAsync(int id)
        {
            return await _context.LogisticOrders
                .Include(o => o.Customer)
                .Include(o => o.Items)
                .Include(o => o.AssignedDeliveryTeam)
                .Include(o => o.AssignedDeliveryZone)
                .Include(o => o.DeliveryAddress)
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<IEnumerable<LogisticOrder>> GetOrdersByCustomerIdAsync(Guid customerId)
        {
            return await _context.LogisticOrders
                .Where(o => o.CustomerId == customerId)
                .Include(o => o.Items)
                .Include(o => o.AssignedDeliveryTeam)
                .Include(o => o.AssignedDeliveryZone)
                .Include(o => o.DeliveryAddress)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<IEnumerable<LogisticOrder>> GetOrdersByDeliveryZoneId(int zoneId)
        {
            return await _context.LogisticOrders
                .Where(o => o.AssignedDeliveryZoneId == zoneId)
                .Include(o => o.Customer)
                .Include(o => o.Items)
                .Include(o => o.AssignedDeliveryTeam)
                .Include(o => o.AssignedDeliveryZone)
                .Include(o => o.DeliveryAddress)
                .ToListAsync();
        }

        public async Task<IEnumerable<LogisticOrder>> GetOrdersByOperatorId(Guid operatorId)
        {
            return await _context.LogisticOrders
                .Where(o => o.AssignedOperatorId == operatorId)
                .Include(o => o.Customer)
                .Include(o => o.Items)
                .Include(o => o.AssignedDeliveryTeam)
                .Include(o => o.AssignedDeliveryZone)
                .Include(o => o.DeliveryAddress)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<IEnumerable<LogisticOrder>> GetOrdersByStatus(OrderStatus status)
        {
            return await _context.LogisticOrders
                .Where(o => o.Status == status)
                .Include(o => o.Customer)
                .Include(o => o.Items)
                .Include(o => o.AssignedDeliveryTeam)
                .Include(o => o.AssignedDeliveryZone)
                .Include(o => o.DeliveryAddress)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<IEnumerable<LogisticOrder>> GetOrdersByTeamId(int teamId)
        {
            return await _context.LogisticOrders
                .Where(o => o.AssignedDeliveryTeamId == teamId)
                .Include(o => o.Customer)
                .Include(o => o.Items)
                .Include(o => o.AssignedDeliveryTeam)
                .Include(o => o.AssignedDeliveryZone)
                .Include(o => o.DeliveryAddress)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<(List<LogisticOrder> Orders, int TotalCount)> GetPagedAsync(int pageNumber, int pageSize, CancellationToken cancellationToken)
        {
            var query = _context.LogisticOrders
                .Include(o => o.Customer)
                .Include(o => o.Items)
                .Include(o => o.AssignedDeliveryTeam)
                .Include(o => o.AssignedDeliveryZone)
                .Include(o => o.DeliveryAddress)
                .AsNoTracking();

            var totalCount = await query.CountAsync(cancellationToken);

            var orders = await query
                .OrderByDescending(o => o.OrderDate)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            return (orders, totalCount);
        }

        public async Task UpdateAsync(LogisticOrder order)
        {
            _context.LogisticOrders.Update(order);
            await _context.SaveChangesAsync();
        }
    }
}
