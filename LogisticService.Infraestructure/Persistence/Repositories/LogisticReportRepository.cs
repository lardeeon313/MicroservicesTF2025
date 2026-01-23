using LogisticService.Domain.Entities;
using LogisticService.Domain.Enums;
using LogisticService.Domain.IRepositories;
using LogisticService.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using SharedKernel.Application.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Infraestructure.Persistence
{
    public class LogisticReportRepository : ILogisticReportRepository
    {
        private readonly LogisticDbContext _context;
        public LogisticReportRepository(LogisticDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<CustomerIncidentReport>> GetCustomersWithMostIncidentsAsync(DateTime? startDate, DateTime? endDate, Guid? customerId, string? incidentType, int pageNumber, int pageSize)
        {
            var query = _context.LogisticOrders
                .Include(o => o.Customer)
                .Include(o => o.DeliveryIncidents)
                .Include(o => o.RejectionReasons)
                .AsNoTracking()
                .AsQueryable();

            if (startDate.HasValue)
                query = query.Where(o => o.OrderDate >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(o => o.OrderDate <= endDate.Value);

            if (customerId.HasValue)
                query = query.Where(o => o.CustomerId == customerId.Value);

            if (!string.IsNullOrWhiteSpace(incidentType))
                query = query.Where(o => o.DeliveryIncidents.Any(i => i.IncidentType == incidentType));

            var grouped = query
                .GroupBy(o => o.CustomerId)
                .Select(g => new CustomerIncidentReport
                {
                    CustomerId = g.Key,
                    CustomerName = g.Select(o => (o.Customer.FirstName + " " + o.Customer.LastName))
                        .FirstOrDefault() ?? string.Empty,
                    TotalOrders = g.Count(),
                    TotalIncidents = g.Sum(o => o.DeliveryIncidents.Count),
                    TotalRejections = g.Sum(o => o.RejectionReasons.Count)
                });

            var totalCount = await grouped.CountAsync();

            var pagedData = await grouped
                .OrderByDescending(r => r.TotalIncidents + r.TotalRejections)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            foreach (var c in pagedData)
            {
                c.IncidentRatePercent = c.TotalOrders > 0
                    ? Math.Round((double)c.TotalIncidents / c.TotalOrders * 100, 2)
                    : 0;

                c.RejectionRatePercent = c.TotalOrders > 0
                    ? Math.Round((double)c.TotalRejections / c.TotalOrders * 100, 2)
                    : 0;
            }

            return new PagedResult<CustomerIncidentReport>
            {
                Items = pagedData,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<PagedResult<DeliveryIncident>> GetDeliveryIncidentsReportQuery(DateTime? startDate,DateTime? endDate,int? deliveryZoneId,int? deliveryTeamId,Guid? operatorId,bool? resolved,int pageNumber,int pageSize)
        {
            var query = _context.DeliveryIncidents
                .Include(i => i.LogisticOrder)
                    .ThenInclude(o => o.Customer)
                .Include(i => i.LogisticOrder.AssignedDeliveryZone)
                .Include(i => i.LogisticOrder.AssignedDeliveryTeam)
                .AsNoTracking()
                .AsQueryable();

            if (startDate.HasValue)
                query = query.Where(i => i.ReportedAt >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(i => i.ReportedAt <= endDate.Value);

            if (deliveryZoneId.HasValue)
                query = query.Where(i => i.LogisticOrder.AssignedDeliveryZoneId == deliveryZoneId.Value);

            if (deliveryTeamId.HasValue)
                query = query.Where(i => i.LogisticOrder.AssignedDeliveryTeamId == deliveryTeamId.Value);

            if (operatorId.HasValue)
                query = query.Where(i => i.ReportedByOperatorId == operatorId.Value);

            if (resolved.HasValue)
            {
                if (resolved.Value)
                {
                    // Solo incidentes realmente resueltos
                    query = query.Where(i =>
                        i.Resolved == true &&
                        i.ResolvedAt != null &&
                        !string.IsNullOrWhiteSpace(i.ResolutionNote)
                    );
                }
                else
                {
                    // Solo NO resueltos: false o NULL
                    query = query.Where(i =>
                        i.Resolved != true ||
                        i.ResolvedAt == null ||
                        string.IsNullOrWhiteSpace(i.ResolutionNote)
                    );
                }
            }

            var totalCount = await query.CountAsync();

            var pagedData = await query
                .OrderByDescending(i => i.ReportedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<DeliveryIncident>
            {
                Items = pagedData,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }


        public async Task<PagedResult<DeliveryRejectionReason>> GetDeliveryRejectionsAsync(DateTime? startDate, DateTime? endDate, int? deliveryZoneId, int? deliveryTeamId, Guid? operatorId, int pageNumber, int pageSize)
        {
            var query = _context.DeliveryRejectionReasons
                    .Include(r => r.LogisticOrder)
                        .ThenInclude(o => o.Customer)
                    .Include(r => r.LogisticOrder.AssignedDeliveryZone)
                    .Include(r => r.LogisticOrder.AssignedDeliveryTeam)
                    .AsNoTracking()
                    .AsQueryable();

            if (startDate.HasValue)
                query = query.Where(r => r.RejectedAt >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(r => r.RejectedAt <= endDate.Value);

            if (deliveryZoneId.HasValue)
                query = query.Where(r => r.LogisticOrder.AssignedDeliveryZoneId == deliveryZoneId.Value);

            if (deliveryTeamId.HasValue)
                query = query.Where(r => r.LogisticOrder.AssignedDeliveryTeamId == deliveryTeamId.Value);

            if (operatorId.HasValue)
                query = query.Where(r => r.DeliveryOperatorId == operatorId.Value);

            var totalCount = await query.CountAsync();

            var pagedData = await query
                .OrderByDescending(i => i.RejectedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<DeliveryRejectionReason>
            {
                Items = pagedData,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<List<TeamActivityReport>> GetDeliveryTeamActivityAsync(DateTime? startDate, DateTime? endDate, int? deliveryTeamId, int? deliveryZoneId)
        {
            var query = _context.LogisticOrders
                .Include(o => o.AssignedDeliveryTeam)
                .Include(o => o.AssignedDeliveryZone)
                .Include(o => o.DeliveryIncidents)
                .Include(o => o.RejectionReasons)
                .AsNoTracking()
                .AsQueryable();

            if (startDate.HasValue)
                query = query.Where(o => o.OrderDate >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(o => o.OrderDate <= endDate.Value);

            if (deliveryTeamId.HasValue)
                query = query.Where(o => o.AssignedDeliveryTeamId == deliveryTeamId.Value);

            if (deliveryZoneId.HasValue)
                query = query.Where(o => o.AssignedDeliveryZoneId == deliveryZoneId.Value);

            query = query.Where(o => o.AssignedDeliveryTeamId != null);

            var grouped = await query
                .GroupBy(o => new { o.AssignedDeliveryTeamId, TeamName = o.AssignedDeliveryTeam!.TeamName })
                .Select(g => new TeamActivityReport
                {
                    DeliveryTeamId = g.Key.AssignedDeliveryTeamId ?? 0,
                    TeamName = g.Key.TeamName,
                    TotalOrders = g.Count(),
                    DeliveredOrders = g.Count(o => o.Status == OrderStatus.Delivered),
                    OnTheWayOrders = g.Count(o => o.Status == OrderStatus.OnTheWay),
                    PendingCashVerificationOrders = g.Count(o => o.Status == OrderStatus.PendingCashVerification),
                    IncidentsCount = g.Sum(o => o.DeliveryIncidents.Count),
                    RejectionsCount = g.Sum(o => o.RejectionReasons.Count),
                    AverageDeliveryTimeHours = g.Average(o =>
                        o.DeliveryDate.HasValue
                            ? EF.Functions.DateDiffHour(o.OrderDate, o.DeliveryDate.Value)
                            : 0)
                })
                .ToListAsync();

            // Calcular tasas
            foreach (var t in grouped)
            {
                t.IncidentRatePercent = t.TotalOrders > 0
                    ? Math.Round((double)t.IncidentsCount / t.TotalOrders * 100, 2)
                    : 0;

                t.RejectionRatePercent = t.TotalOrders > 0
                    ? Math.Round((double)t.RejectionsCount / t.TotalOrders * 100, 2)
                    : 0;

                t.DeliverySuccessRatePercent = t.TotalOrders > 0
                    ? Math.Round((double)t.DeliveredOrders / t.TotalOrders * 100, 2)
                    : 0;
            }

            return grouped;
        }

        public async Task<List<LogisticOrder>> GetFilteredOrdersAsync(DateTime? startDate,DateTime? endDate,int? deliveryZoneId,int? deliveryTeamId,Guid? operatorId,PaymentType? paymentType)
        {
            var query = _context.LogisticOrders
                .AsNoTracking()
                .Include(o => o.AssignedDeliveryTeam)
                .Include(o => o.AssignedDeliveryZone)
                .Include(o => o.StatusHistory)
                .AsQueryable();

            
            if (startDate.HasValue)
            {
                query = query.Where(o =>
                    o.StatusHistory.Any(h =>
                        h.NewStatus == OrderStatus.Delivered &&
                        h.ChangedAt >= startDate.Value
                    ));
            }

            if (endDate.HasValue)
            {
                query = query.Where(o =>
                    o.StatusHistory.Any(h =>
                        h.NewStatus == OrderStatus.Delivered &&
                        h.ChangedAt <= endDate.Value
                    ));
            }

            if (deliveryZoneId.HasValue)
                query = query.Where(o => o.AssignedDeliveryZoneId == deliveryZoneId.Value);

            if (deliveryTeamId.HasValue)
                query = query.Where(o => o.AssignedDeliveryTeamId == deliveryTeamId.Value);

            if (operatorId.HasValue)
                query = query.Where(o => o.AssignedOperatorId == operatorId.Value);

            if (paymentType.HasValue)
                query = query.Where(o => o.PaymentType == paymentType.Value);

            return await query.ToListAsync();
        }


        public async Task<PagedResult<OrderStatusHistoryReport>> GetOrderStatusHistoryAsync(DateTime? startDate, DateTime? endDate, OrderStatus? oldStatus, OrderStatus? newStatus, Guid? operatorId, int pageNumber, int pageSize)
        {
            var query = _context.OrderStatusHistories
                .Include(h => h.LogisticOrder)
                    .ThenInclude(o => o.Customer)
                .Include(h => h.LogisticOrder.AssignedDeliveryTeam)
                .AsNoTracking()
                .AsQueryable();

            if (startDate.HasValue)
                query = query.Where(h => h.ChangedAt >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(h => h.ChangedAt <= endDate.Value);

            if (oldStatus.HasValue)
                query = query.Where(h => h.OldStatus == oldStatus.Value);

            if (newStatus.HasValue)
                query = query.Where(h => h.NewStatus == newStatus.Value);

            if (operatorId.HasValue)
                query = query.Where(h => h.LogisticOrder.AssignedOperatorId == operatorId.Value);

            var totalCount = await query.CountAsync();

            var results = await query
                .OrderBy(h => h.Id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<OrderStatusHistoryReport>
            {
                Items = results.Select(h => new OrderStatusHistoryReport
                {
                    Id = h.Id,
                    OrderId = h.OrderId,
                    CustomerName = $"{h.LogisticOrder.Customer.FirstName} {h.LogisticOrder.Customer.LastName}".Trim(),
                    OldStatus = h.OldStatus.ToString(),
                    NewStatus = h.NewStatus.ToString(),
                    ChangedAt = h.ChangedAt,
                    AverageDurationSeconds = h.AverageDuration,
                    AssignedOperatorId = h.LogisticOrder.AssignedOperatorId,
                    AssignedTeamName = h.LogisticOrder.AssignedDeliveryTeam?.TeamName
                }).ToList(),
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<List<ZonePerformanceReport>> GetZonePerformanceAsync(DateTime? startDate, DateTime? endDate, int? deliveryZoneId, int? deliveryTeamId)
        {
            var query = _context.LogisticOrders
                    .Include(o => o.AssignedDeliveryZone)
                    .Include(o => o.AssignedDeliveryTeam)
                    .Include(o => o.DeliveryIncidents)
                    .Include(o => o.RejectionReasons)
                    .AsNoTracking()
                    .AsQueryable();

            if (startDate.HasValue)
                query = query.Where(o => o.OrderDate >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(o => o.OrderDate <= endDate.Value);

            if (deliveryZoneId.HasValue)
                query = query.Where(o => o.AssignedDeliveryZoneId == deliveryZoneId.Value);

            if (deliveryTeamId.HasValue)
                query = query.Where(o => o.AssignedDeliveryTeamId == deliveryTeamId.Value);

            query = query.Where(o => o.AssignedDeliveryZoneId != null);

            var grouped = await query
                .GroupBy(o => new { o.AssignedDeliveryZoneId, ZoneName = o.AssignedDeliveryZone!.Name })
                .Select(g => new ZonePerformanceReport
                {
                    DeliveryZoneId = g.Key.AssignedDeliveryZoneId ?? 0,
                    DeliveryZoneName = g.Key.ZoneName,

                    TotalOrders = g.Count(),
                    DeliveredOrders = g.Count(o => o.Status == OrderStatus.Delivered),
                    IncidentsCount = g.Sum(o => o.DeliveryIncidents.Count),
                    RejectionsCount = g.Sum(o => o.RejectionReasons.Count),

                    AverageDeliveryTimeHours = g.Average(o =>
                        o.DeliveryDate.HasValue
                            ? EF.Functions.DateDiffHour(o.OrderDate, o.DeliveryDate.Value)
                            : 0),

                    TopTeamName = g.GroupBy(o => o.AssignedDeliveryTeam!.TeamName)
                                   .OrderByDescending(t => t.Count())
                                   .Select(t => t.Key)
                                   .FirstOrDefault(),

                    TopTeamId = g.GroupBy(o => o.AssignedDeliveryTeamId)
                                 .OrderByDescending(t => t.Count())
                                 .Select(t => t.Key)
                                 .FirstOrDefault()
                })
                .ToListAsync();

            // Calcular tasas
            foreach (var z in grouped)
            {
                z.IncidentRatePercent = z.TotalOrders > 0
                    ? Math.Round((double)z.IncidentsCount / z.TotalOrders * 100, 2)
                    : 0;

                z.RejectionRatePercent = z.TotalOrders > 0
                    ? Math.Round((double)z.RejectionsCount / z.TotalOrders * 100, 2)
                    : 0;

                z.DeliverySuccessRatePercent = z.TotalOrders > 0
                    ? Math.Round((double)z.DeliveredOrders / z.TotalOrders * 100, 2)
                    : 0;
            }

            return grouped;
        }

        public async Task<PagedResult<LogisticOrder>> GetPendingCashVerificationAsync(
            DateTime? startDate,
            DateTime? endDate,
            Guid? operatorId,
            int? deliveryTeamId,
            int pageNumber,
            int pageSize)
        {
            var query = _context.LogisticOrders
                .Include(o => o.Customer)
                .Include(o => o.AssignedDeliveryTeam)
                .AsNoTracking()
                .AsQueryable();

            // Filtrar por fecha de pedido
            if (startDate.HasValue)
                query = query.Where(o => o.OrderDate >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(o => o.OrderDate <= endDate.Value);

            // Filtrar por operador
            if (operatorId.HasValue)
                query = query.Where(o => o.AssignedOperatorId == operatorId.Value);

            // Filtrar por equipo de entrega
            if (deliveryTeamId.HasValue)
                query = query.Where(o => o.AssignedDeliveryTeamId == deliveryTeamId.Value);

            // Solo pedidos pendientes de verificación de efectivo
            query = query.Where(o => o.Status == OrderStatus.PendingCashVerification);

            var totalCount = await query.CountAsync();

            var results = await query
                .OrderByDescending(h => h.OrderDate)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<LogisticOrder>
            {
                Items = results,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }
    }
}
