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
                .Include(o => o.DeliveryIncidents)
                .Include(o => o.RejectionReasons)
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
                .Include(o => o.DeliveryIncidents)
                .Include(o => o.RejectionReasons)
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
                .Include(o => o.DeliveryIncidents)
                .Include(o => o.RejectionReasons)
                .Include(o => o.Customer)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<IEnumerable<LogisticOrder>> GetOrdersByDeliveryPriorityAsync(DeliveryPriority priority)
        {
            return await _context.LogisticOrders
                .Where(o => o.DeliveryPriority == priority)
                .Include(o => o.Items)
                .Include(o => o.AssignedDeliveryTeam)
                .Include(o => o.AssignedDeliveryZone)
                .Include(o => o.DeliveryAddress)
                .Include(o => o.DeliveryIncidents)
                .Include(o => o.RejectionReasons)
                .Include(o => o.Customer)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<IEnumerable<LogisticOrder>> GetOrdersByDeliveryZoneId(int zoneId)
        {
            return await _context.LogisticOrders
                .Where(o => o.AssignedDeliveryZoneId == zoneId)
                .Include(o => o.Items)
                .Include(o => o.AssignedDeliveryTeam)
                .Include(o => o.AssignedDeliveryZone)
                .Include(o => o.DeliveryAddress)
                .Include(o => o.DeliveryIncidents)
                .Include(o => o.RejectionReasons)
                .Include(o => o.Customer)
                .ToListAsync();
        }

        public async Task<IEnumerable<LogisticOrder>> GetOrdersByOperatorId(Guid operatorId)
        {
            return await _context.LogisticOrders
                .Where(o => o.AssignedOperatorId == operatorId)
                .Include(o => o.Items)
                .Include(o => o.AssignedDeliveryTeam)
                .Include(o => o.AssignedDeliveryZone)
                .Include(o => o.DeliveryAddress)
                .Include(o => o.DeliveryIncidents)
                .Include(o => o.RejectionReasons)
                .Include(o => o.Customer)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<IEnumerable<LogisticOrder>> GetOrdersByStatus(OrderStatus status)
        {
            return await _context.LogisticOrders
                .Where(o => o.Status == status)
                .Include(o => o.Items)
                .Include(o => o.AssignedDeliveryTeam)
                .Include(o => o.AssignedDeliveryZone)
                .Include(o => o.DeliveryAddress)
                .Include(o => o.DeliveryIncidents)
                .Include(o => o.RejectionReasons)
                .Include(o => o.Customer)
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
                .Include(o => o.DeliveryIncidents)
                .Include(o => o.RejectionReasons)
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
                .Include(o => o.DeliveryIncidents)
                .Include(o => o.RejectionReasons)
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

        //////////////////////////////////////////
        /// QUERIES PARA OPERADORES DE REPARTO ///
        //////////////////////////////////////////
        public async Task<IEnumerable<DeliveryRejectionReason>> GetRejectionReasonsByOrderIdAsync(int logisticOrderId)
        {
            return await _context.DeliveryRejectionReasons
                .Where(r => r.LogisticOrderId == logisticOrderId)
                .ToListAsync();
        }

        public async Task<List<LogisticOrder>> GetMyAssignedOrders(Guid operatorId)
        {
            return await _context.LogisticOrders
                    .Where(o => o.AssignedOperatorId == operatorId && o.Status == OrderStatus.AssignedDelivery)
                    .Include(o => o.Customer)
                    .Include(o => o.Items)
                    .Include(o => o.AssignedDeliveryTeam)
                    .Include(o => o.AssignedDeliveryZone)
                    .Include(o => o.DeliveryAddress)
                    .AsNoTracking()
                    .ToListAsync();
        }

        public async Task<List<LogisticOrder>> GetMyDeliveredOrders(Guid operatorId)
        {
            return await _context.LogisticOrders
                    .Where(o => o.AssignedOperatorId == operatorId && (o.Status == OrderStatus.Delivered
                                                                      || o.Status == OrderStatus.CashVerified
                                                                      || o.Status == OrderStatus.PendingCashVerification))                    
                    .Include(o => o.Customer)
                    .Include(o => o.Items)
                    .Include(o => o.AssignedDeliveryTeam)
                    .Include(o => o.AssignedDeliveryZone)
                    .Include(o => o.DeliveryAddress)
                    .Include(o => o.DeliveryIncidents)
                    .AsNoTracking()
                    .ToListAsync();
        }

        public async Task<List<LogisticOrder>> GetMyOnTheWayOrders(Guid operatorId)
        {
            return await _context.LogisticOrders
                    .Where(o => o.AssignedOperatorId == operatorId && o.Status == OrderStatus.OnTheWay)                    
                    .Include(o => o.Customer)
                    .Include(o => o.Items)
                    .Include(o => o.AssignedDeliveryTeam)
                    .Include(o => o.AssignedDeliveryZone)
                    .Include(o => o.DeliveryAddress)
                    .Include(o => o.DeliveryIncidents)
                    .AsNoTracking()
                    .ToListAsync();
        }

        public async Task<List<LogisticOrder>> GetMyPendingCashOrders(Guid operatorId)
        {
            return await _context.LogisticOrders
                    .Where(o => o.AssignedOperatorId == operatorId && o.Status == OrderStatus.PendingCashVerification && o.PaymentType == PaymentType.Cash)                    
                    .Include(o => o.Customer)
                    .Include(o => o.Items)
                    .Include(o => o.AssignedDeliveryTeam)
                    .Include(o => o.AssignedDeliveryZone)
                    .Include(o => o.DeliveryAddress)
                    .Include(o => o.DeliveryIncidents)
                    .AsNoTracking()
                    .ToListAsync();
        }

        public async Task<List<LogisticOrder>> GetMyPendingDeliveredOrders(Guid operatorId)
        {
            return await _context.LogisticOrders
                    .Where(o => o.AssignedOperatorId == operatorId && o.Status == OrderStatus.PendingDelivery)                                        
                    .Include(o => o.Customer)
                    .Include(o => o.Items)
                    .Include(o => o.DeliveryAddress)
                    .Include(o => o.Customer)
                    .Include(o => o.Items)
                    .Include(o => o.AssignedDeliveryTeam)
                    .Include(o => o.AssignedDeliveryZone)
                    .Include(o => o.DeliveryAddress)
                    .Include(o => o.RejectionReasons)
                    .AsNoTracking()
                    .ToListAsync();
        }


        public async Task AddDeliveryRejectionAsync(DeliveryRejectionReason rejectionReason)
        {
            await _context.DeliveryRejectionReasons.AddAsync(rejectionReason);
            await _context.SaveChangesAsync();
        }

        public async Task<List<LogisticOrder>> GetMyOrdersWithDeliveryIncident(Guid operatorId)
        {
            return await _context.LogisticOrders
                    .Where(o => o.AssignedOperatorId == operatorId)
                    .Where(o => _context.DeliveryIncidents.Any(r => r.LogisticOrderId == o.Id))
                    .Include(o => o.Customer)
                    .Include(o => o.Items)
                    .Include(o => o.DeliveryAddress)
                    .Include(o => o.Customer)
                    .Include(o => o.Items)
                    .Include(o => o.AssignedDeliveryTeam)
                    .Include(o => o.AssignedDeliveryZone)
                    .Include(o => o.DeliveryAddress)
                    .Include(o => o.DeliveryIncidents)
                    .AsNoTracking()
                    .ToListAsync();
        }

        public async Task<List<LogisticOrder>> GetMyRejectOrders(Guid operatorId)
        {
            return await _context.LogisticOrders
                    .Where(o => _context.DeliveryRejectionReasons.Any(r => r.LogisticOrderId == o.Id && r.DeliveryOperatorId == operatorId))
                    .Include(o => o.Customer)
                    .Include(o => o.Items)
                    .Include(o => o.DeliveryAddress)
                    .Include(o => o.Customer)
                    .Include(o => o.Items)
                    .Include(o => o.AssignedDeliveryTeam)
                    .Include(o => o.AssignedDeliveryZone)
                    .Include(o => o.DeliveryAddress)
                    .Include(o => o.RejectionReasons)
                    .Include(o => o.DeliveryIncidents)
                    .AsNoTracking()
                    .ToListAsync();
        }

        //////////////////////////////////////////
        /// QUERIES PARA INCIDENTES DE REPARTO ///
        //////////////////////////////////////////

        public async Task AddDeliveryIncidentAsync(DeliveryIncident incident)
        {
            await _context.DeliveryIncidents.AddAsync(incident);
            await _context.SaveChangesAsync();
        }

        public async Task<DeliveryIncident?> GetDeliveryIncidentByIdAsync(int id)
        {
            return await _context.DeliveryIncidents
                    .AsNoTracking()
                    .Include(i => i.LogisticOrder)
                    .FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task<List<DeliveryIncident>> GetDeliveryIncidentByOrderIdAsync(int logisticOrderId)
        {
            return await _context.DeliveryIncidents
                    .AsNoTracking()
                    .Where(i => i.LogisticOrderId == logisticOrderId)
                    .OrderByDescending(i => i.ReportedAt)
                    .ToListAsync();
        }

        public async Task UpdateDeliveryIncidentAsync(DeliveryIncident incident)
        {
            var existingIncident = await _context.DeliveryIncidents
                .FirstOrDefaultAsync(x => x.Id == incident.Id);

            if (existingIncident == null)
                throw new Exception($"No se encontró la incidencia con ID {incident.Id}");

            // Actualizamos los campos directamente en la entidad trackeada
            existingIncident.Resolved = incident.Resolved;
            existingIncident.ResolvedAt = incident.ResolvedAt;
            existingIncident.ResolutionNote = incident.ResolutionNote;
            existingIncident.DeliveryIncidentStatus = incident.DeliveryIncidentStatus;

            await _context.SaveChangesAsync();
        }

        public async Task<List<LogisticOrder>> GetOrdersWithDeliveryRejectionsAsync()
        {
            return await _context.LogisticOrders
                    .Where(o => _context.DeliveryRejectionReasons.Any(r => r.LogisticOrderId == o.Id))
                    .Include(o => o.Customer)
                    .Include(o => o.Items)
                    .Include(o => o.DeliveryAddress)
                    .Include(o => o.Customer)
                    .Include(o => o.Items)
                    .Include(o => o.AssignedDeliveryTeam)
                    .Include(o => o.AssignedDeliveryZone)
                    .Include(o => o.DeliveryAddress)
                    .Include(o => o.RejectionReasons)
                    .AsNoTracking()
                    .ToListAsync();
        }

        public async Task<List<LogisticOrder>> GetOrdersWithDeliveryIncidentsAsync()
        {
            return await _context.LogisticOrders
                    .Where(o => _context.DeliveryIncidents.Any(r => r.LogisticOrderId == o.Id))
                    .Include(o => o.Customer)
                    .Include(o => o.Items)
                    .Include(o => o.DeliveryAddress)
                    .Include(o => o.Customer)
                    .Include(o => o.Items)
                    .Include(o => o.AssignedDeliveryTeam)
                    .Include(o => o.AssignedDeliveryZone)
                    .Include(o => o.DeliveryAddress)
                    .Include(o => o.RejectionReasons)
                    .Include(o => o.DeliveryIncidents)
                    .AsNoTracking()
                    .ToListAsync();
        }


    }
}
