using DepotService.Application.DTOs.Pagination;
using DepotService.Domain.Enums;
using DepotService.Domain.IRepositories;
using DepotService.Domain.ValueObjects;
using DocumentFormat.OpenXml.Spreadsheet;
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

        public async Task<PaginatedResult<CompletedOrdersReport>> GetCompletedOrdersAsync(DateTime? from, DateTime? to, int page, int pageSize)
        {
            var query = _context.DepotOrders
            .AsNoTracking()
            .Where(o => o.Status == OrderStatus.Prepared);

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
                    SalesOrderId = o.SalesOrderId,
                    CustomerName = o.CustomerName,
                    CustomerEmail = o.CustomerEmail,
                    OrderDate = o.OrderDate,
                    CompletedAt = o.StatusHistory
                        .Where(h => h.NewStatus == OrderStatus.Prepared)
                        .OrderByDescending(h => h.ChangedAt)
                        .Select(h => h.ChangedAt)
                        .FirstOrDefault(),
                    DeliveryDate = o.DeliveryDate,
                })
                .ToListAsync();

            return new PaginatedResult<CompletedOrdersReport>
            {
                Items = items,
                TotalItems = totalCount,
                CurrentPage = page,
                TotalPages = pageSize
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
<<<<<<< HEAD

                }).ToListAsync();
            
=======
                    DepotTeamName = o.AssignedDepotTeam != null ? o.AssignedDepotTeam.TeamName : null
                }).ToListAsync();
           
>>>>>>> origin/feature/milton-microservicestf2025
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

            return new PaginatedResult<ReissuedOrderReport>{
                Items = items,
                TotalItems = totalCount,
                TotalPages = pageSize,
                CurrentPage = page,
            };
        }
    }
}
