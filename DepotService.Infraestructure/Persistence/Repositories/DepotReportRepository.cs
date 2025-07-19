using DepotService.Application.DTOs.Pagination;
using DepotService.Domain.Enums;
using DepotService.Domain.IRepositories;
using DepotService.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Infraestructure.Persistence.Repositories
{
    public class DepotReportRepository(DepotDbContext context) : IDepotReportRepository
    {
        private readonly DepotDbContext _context = context;

        public async Task<PaginatedResult<OrderProcessingTime>> GetAverageProcessingTimePerOrderAsync(DateTime? from, DateTime? to, int page, int pageSize)
        {
            var query = _context.OrderStatusHistories.AsQueryable();

            if (from.HasValue)
                query = query.Where(h => h.ChangedAt >= from.Value);
            if (to.HasValue)
                query = query.Where(h => h.ChangedAt <= to.Value);

            var grouped = query
                .GroupBy(h => h.OrderId)
                .Select(g => new
                {
                    OrderId = g.Key,
                    Start = g
                        .Where(h => h.NewStatus == OrderStatus.InPreparation)
                        .OrderBy(h => h.ChangedAt)
                        .Select(h => h.ChangedAt)
                        .FirstOrDefault(),
                    End = g
                        .Where(h => h.NewStatus == OrderStatus.SentToBilling)
                        .OrderByDescending(h => h.ChangedAt)
                        .Select(h => h.ChangedAt)
                        .FirstOrDefault()
                })
                .Where(x => x.Start != default && x.End != default && x.End > x.Start);

            var totalItems = await grouped.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var results = await grouped
                .OrderByDescending(x => x.End)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new OrderProcessingTime
                {
                    OrderId = x.OrderId,
                    DurationMinutes = EF.Functions.DateDiffMinute(x.Start, x.End)
                })
                .ToListAsync();

            return new PaginatedResult<OrderProcessingTime>
            {
                Items = results,
                TotalItems = totalItems,
                TotalPages = totalPages,
                CurrentPage = page
            };
        }

        public async Task<List<OrderStatusAverage>> GetAverageTimePerStatusAsync(DateTime? from, DateTime? to)
        {
            var query = _context.OrderStatusHistories.AsQueryable();

            if (from.HasValue)
                query = query.Where(h => h.ChangedAt >= from.Value);

            if (to.HasValue)
                query = query.Where(h => h.ChangedAt <= to.Value);

            var grouped = await query
                .GroupBy(h => h.NewStatus)
                .Select(g => new
                {
                    Status = g.Key,
                    AvgDuration = g
                        .Select(h => new
                        {
                            Start = h.ChangedAt,
                            End = _context.OrderStatusHistories
                                .Where(next => next.OrderId == h.OrderId && next.ChangedAt > h.ChangedAt)
                                .OrderBy(next => next.ChangedAt)
                                .Select(next => next.ChangedAt)
                                .FirstOrDefault()
                        })
                        .Where(x => x.End != default)
                        .Average(x => EF.Functions.DateDiffMinute(x.Start, x.End))
                })
                .ToListAsync();

            return grouped.Select(x => new OrderStatusAverage
            {
                Status = x.Status,
                AverageDuration = x.AvgDuration
            }).ToList();
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
                orders = orders.Where(o => o.StatusHistory.Any(h => h.ChangedAt >= from.Value));

            if (to.HasValue)
                orders = orders.Where(o => o.StatusHistory.Any(h => h.ChangedAt <= to.Value));

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
    }
}
