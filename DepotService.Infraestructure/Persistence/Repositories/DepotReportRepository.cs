using DepotService.Application.DTOs.Pagination;
using DepotService.Domain.Enums;
using DepotService.Domain.IRepositories;
using DepotService.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DepotService.Infraestructure.Persistence.Repositories
{
    public class DepotReportRepository : IDepotReportRepository
    {
        private readonly DepotDbContext _context;
        private readonly ILogger<DepotReportRepository> _logger;

        public DepotReportRepository(DepotDbContext context, ILogger<DepotReportRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<PaginatedResult<OrderProcessingTime>> GetAverageProcessingTimePerOrderAsync(DateTime? from, DateTime? to, string? operatorId, string? customer, int page, int pageSize)
        {
            var query = _context.DepotOrders
                .Include(o => o.StatusHistory)
                .AsQueryable();

            // filtro por rango de fechas
            if (from.HasValue)
                query = query.Where(o => o.StatusHistory.Any(h => h.ChangedAt >= from.Value));

            if (to.HasValue)
                query = query.Where(o => o.StatusHistory.Any(h => h.ChangedAt <= to.Value));

            if (!string.IsNullOrEmpty(operatorId)
                && Guid.TryParse(operatorId, out var opGuid))
                query = query.Where(o => o.AssignedOperatorId == opGuid);

            if (!string.IsNullOrEmpty(customer))
                query = query.Where(o => o.CustomerName.Contains(customer));

            // proceso de calculo de tiempos
            var processed = query
                .Select(o => new
                {
                    o.DepotOrderId,
                    o.CustomerName,
                    o.AssignedOperatorId,

                    StartPreparation = o.StatusHistory
                        .Where(h => h.NewStatus == OrderStatus.InPreparation)
                        .OrderBy(h => h.ChangedAt)
                        .Select(h => h.ChangedAt)
                        .FirstOrDefault(),

                    Prepared = o.StatusHistory
                        .Where(h => h.NewStatus == OrderStatus.Prepared)
                        .OrderBy(h => h.ChangedAt)
                        .Select(h => h.ChangedAt)
                        .FirstOrDefault()
                })
                .Where(x =>
                    x.StartPreparation != default &&
                    x.Prepared != default &&
                    x.Prepared > x.StartPreparation);
            // paginacion
            var totalItems = await processed.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var items = await processed
                .OrderByDescending(x => x.Prepared)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new OrderProcessingTime
                {
                    OrderId = x.DepotOrderId,
                    CustomerName = x.CustomerName,
                    OperatorId = x.AssignedOperatorId,
                    StartPreparation = x.StartPreparation,
                    Prepared = x.Prepared,
                    DurationMinutes = EF.Functions.DateDiffMinute(x.StartPreparation, x.Prepared)
                })
                .ToListAsync();

            return new PaginatedResult<OrderProcessingTime>
            {
                Items = items,
                TotalItems = totalItems,
                TotalPages = totalPages,
                CurrentPage = page
            };
        }

        public async Task<List<OrderStatusAverage>> GetAverageTimePerStatusAsync(DateTime? from, DateTime? to)
        {
            var query = _context.OrderStatusHistories
                .Include(h => h.DepotOrderEntity)
                .AsQueryable();

            if (from.HasValue)
                query = query.Where(h => h.ChangedAt >= from.Value);

            if (to.HasValue)
                query = query.Where(h => h.ChangedAt <= to.Value);

            var histories = await query
                .OrderBy(h => h.OrderId)
                .ThenBy(h => h.ChangedAt)
                .ToListAsync();

            var result = new List<OrderStatusAverage>();

            foreach (var history in histories)
            {
                var next = histories
                    .Where(n => n.OrderId == history.OrderId && n.ChangedAt > history.ChangedAt)
                    .OrderBy(n => n.ChangedAt)
                    .FirstOrDefault();

                var duration = next != null
                    ? (next.ChangedAt - history.ChangedAt).TotalMinutes
                    : 0;

                result.Add(new OrderStatusAverage
                {
                    Id = history.Id,
                    OrderId = history.OrderId,
                    CustomerName = history.DepotOrderEntity.CustomerName,
                    OldStatus = history.OldStatus,
                    NewStatus = history.NewStatus,
                    ChangedAt = history.ChangedAt,
                    AverageDuration = duration
                });
            }

            return result;
        }

        public async Task<PaginatedResult<CompletedOrdersReport>> GetCompletedOrdersAsync(DateTime? from, DateTime? to, int page, int pageSize)
        {
            var query = _context.DepotOrders
        .AsNoTracking()
        .Include(o => o.StatusHistory)
        .Where(o => o.Status >= OrderStatus.Prepared);

            if (from.HasValue)
                query = query.Where(o => o.OrderDate >= from.Value);

            if (to.HasValue)
                query = query.Where(o => o.OrderDate <= to.Value);

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(o => o.OrderDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(o => new CompletedOrdersReport
                {
                    DepotOrderId = o.DepotOrderId,
                    CustomerName = o.CustomerName,
                    OperatorId = o.AssignedOperatorId,
                    OrderDate = o.OrderDate,

                    PreparedAt = o.StatusHistory
                        .Where(h => h.NewStatus == OrderStatus.Prepared)
                        .OrderBy(h => h.ChangedAt)
                        .Select(h => h.ChangedAt)
                        .FirstOrDefault(),

                    DeliveryDate = o.DeliveryDate
                })
                .ToListAsync();

            return new PaginatedResult<CompletedOrdersReport>
            {
                Items = items,
                TotalItems = totalCount,
                CurrentPage = page,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            };
        }

        public async Task<List<DepotTeamPerformance>> GetDepotTeamPerformancesAsync(DateTime? from, DateTime? to)
        {
            var orders = _context.DepotOrders
                .Include(o => o.AssignedDepotTeam)
                .Include(o => o.StatusHistory)
                .Include(o => o.Missings)
                .Where(o => o.AssignedDepotTeamId != null)
                .AsQueryable();

            if (from.HasValue)
            {
               
                orders = orders.Where(o =>
                    o.OrderDate >= from.Value || (o.DeliveryDate.HasValue && o.DeliveryDate.Value >= from.Value));
            }

            if (to.HasValue)
            {
                
                orders = orders.Where(o =>
                    o.OrderDate <= to.Value || (o.DeliveryDate.HasValue && o.DeliveryDate.Value <= to.Value));
            }

            var grouped = await orders
                .GroupBy(o => new { o.AssignedDepotTeamId, o.AssignedDepotTeam!.TeamName })
                .Select(g => new DepotTeamPerformance
                {
                    DepotTeamId = g.Key.AssignedDepotTeamId!.Value,
                    TeamName = g.Key.TeamName,
                    OrdersHandled = g.Count(),
                    MissingItemsReported = g.SelectMany(o => o.Missings).Count(),
                    AverageProcessingTimeMinutes = (int)g.Average(o =>
                        EF.Functions.DateDiffMinute(
                            o.StatusHistory
                                .Where(s => s.NewStatus == OrderStatus.InPreparation)
                                .OrderBy(s => s.ChangedAt)
                                .Select(s => s.ChangedAt)
                                .FirstOrDefault(),
                            o.StatusHistory
                                .Where(s => s.NewStatus == OrderStatus.SentToBilling)
                                .OrderByDescending(s => s.ChangedAt)
                                .Select(s => s.ChangedAt)
                                .FirstOrDefault()
                        ))
                })
                .ToListAsync();

            return grouped;
        }

        public async Task<List<OrderStatusCount>> GetOrderCountPerStatusAsync(DateTime? from, DateTime? to)
        {
            var query = _context.OrderStatusHistories.AsQueryable();

            if (from.HasValue)
                query = query.Where(h => h.ChangedAt >= from.Value);

            if (to.HasValue)
                query = query.Where(h => h.ChangedAt <= to.Value);

            var grouped = await query
                .GroupBy(h => h.NewStatus)
                .Select(g => new OrderStatusCount
                {
                    Status = g.Key.ToString(),
                    Count = g.Count()
                })
                .ToListAsync();

            return grouped;
        }

        public async Task<PaginatedResult<OrderByDeliveryDate>> GetOrdersByDeliveryDateAsync(DateTime? from, DateTime? to, int page, int pageSize)
        {
            var query = _context.DepotOrders
                .Where(o => o.DeliveryDate != null);

            if (from.HasValue)
                query = query.Where(o => o.DeliveryDate >= from.Value);
            if (to.HasValue)
                query = query.Where(o => o.DeliveryDate <= to.Value);

            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var items = await query
                .OrderBy(o => o.DeliveryDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(o => new OrderByDeliveryDate
                {
                    OrderId = o.DepotOrderId,
                    DeliveryDetail = o.DeliveryDetail,
                    DeliveryDate = o.DeliveryDate!
                })
                .ToListAsync();

            return new PaginatedResult<OrderByDeliveryDate>
            {
                Items = items,
                TotalItems = totalItems,
                TotalPages = totalPages,
                CurrentPage = page,
            };
        }

        public async Task<PaginatedResult<OrdersInPreparation>> GetOrdersInPreparationAsync(int page, int pageSize, DateTime? from, DateTime? to)
        {
            var query = _context.DepotOrders
                .Include(o => o.AssignedDepotTeam)
                .Include(o => o.StatusHistory)
                .Where(o => o.Status == OrderStatus.InPreparation);

            if (from.HasValue)
                query = query.Where(o => o.OrderDate >= from.Value);

            if (to.HasValue)
                query = query.Where(o => o.OrderDate <= to.Value);

            var total = await query.CountAsync();

            var data = await query
                .OrderByDescending(o => o.OrderDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(o => new OrdersInPreparation
                {
                    OrderId = o.DepotOrderId,
                    CreatedAt = o.OrderDate,
                    CustomerName = o.CustomerName,
                    CustomerEmail = o.CustomerEmail,
                    PhoneNumber = o.PhoneNumber,
                    DeliveryDetail = o.DeliveryDetail,
                    InPreparationAt = o.StatusHistory
                        .Where(h => h.NewStatus == OrderStatus.InPreparation)
                        .OrderByDescending(h => h.ChangedAt)
                        .Select(h => h.ChangedAt)
                        .FirstOrDefault(),
                    DeliveryDate = o.DeliveryDate,
                    DepotTeamName = o.AssignedDepotTeam != null ? o.AssignedDepotTeam.TeamName : null
                }).ToListAsync();

            return new PaginatedResult<OrdersInPreparation>
            {
                Items = data,
                TotalItems = total,
                TotalPages = pageSize,
                CurrentPage = page,
            };
        }

        public async Task<PaginatedResult<ReissuedOrderReport>> GetReissuedOrdersAsync(DateTime? from, DateTime? to, int page, int pageSize)
        {
            var query = _context.DepotOrders
                .Include(o => o.StatusHistory)
                .Where(o => o.StatusHistory.Any(h =>
                    h.NewStatus == OrderStatus.ReReceived &&
                    (!from.HasValue || h.ChangedAt >= from.Value) &&
                    (!to.HasValue || h.ChangedAt <= to.Value)))
                .AsNoTracking();

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(o => o.OrderDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(o => new ReissuedOrderReport
                {
                    DepotOrderId = o.DepotOrderId,
                    SalesOrderId = o.SalesOrderId,
                    CustomerId = o.CustomerId,
                    CustomerName = o.CustomerName,
                    CustomerEmail = o.CustomerEmail,
                    PhoneNumber = o.PhoneNumber,
                    OrderDate = o.OrderDate,
                    DeliveryDate = o.DeliveryDate,
                    ReissuedAt = o.StatusHistory
                        .Where(h => h.NewStatus == OrderStatus.ReReceived)
                        .OrderByDescending(h => h.ChangedAt)
                        .First().ChangedAt
                })
                .ToListAsync();

            return new PaginatedResult<ReissuedOrderReport>
            {
                Items = items,
                TotalItems = totalCount,
                TotalPages = pageSize,
                CurrentPage = page,
            };
        }
    }
}
