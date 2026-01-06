using Microsoft.EntityFrameworkCore;
using SalesService.Domain.Enums;
using SalesService.Domain.Helper;
using SalesService.Domain.IRepositories;
using SalesService.Domain.ValueObjects;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Infraestructure.Persistence.Repositories
{
    public class ReportRepository(SalesDbContext context) : IReportRepository
    {
        private readonly SalesDbContext _context = context;

        // Reporte de tipos de pago por cliente
        public async Task<PagedResult<CustomerPaymentTypeReport>> GetCustomerPaymentTypeReportAsync(string? name, List<PaymentType>? paymentTypes, DateTime? from, DateTime? to, int page, int pageSize)
        {
            var query = _context.Customers
                .AsNoTracking()
                .Where(c => c.IsActive)
                .Select(c => new
            {
                c.Id,
                FullName = c.FirstName + " " + c.LastName,

                Address = c.Addresses
                    .OrderBy(a => a.CreatedAt)
                    .Select(a =>
                        a.Street + " " + a.Number + ", " + a.City)
                    .FirstOrDefault() ?? "Sin dirección",

                PaymentTypes = c.PaymentTypes
                    .Select(pt => pt.PaymentType)
            })
            .AsQueryable();

            // 🔍 Filtro por nombre
            if (!string.IsNullOrWhiteSpace(name))
                query = query.Where(x => x.FullName.Contains(name));

            // 🔍 Filtro por tipos de pago
            if (paymentTypes is { Count: > 0 })
                query = query.Where(x =>
                    x.PaymentTypes.Any(pt => paymentTypes.Contains(pt)));

            var total = await query.CountAsync();

            var items = await query
                .OrderBy(x => x.FullName)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new CustomerPaymentTypeReport
                {
                    CustomerId = x.Id,
                    FullName = x.FullName,
                    Address = x.Address,
                    PaymentTypes = x.PaymentTypes.Distinct().ToList()
                })
                .ToListAsync();

            return new PagedResult<CustomerPaymentTypeReport>
            {
                Items = items,
                TotalCount = total,
                PageNumber = page,
                PageSize = pageSize
            };
        }

        // Reporte de clientes con filtros y paginacion
        public async Task<PagedResult<CustomerReport>> GetCustomerReportAsync(
             string? name,
             string? email,
             int? minOrders,
             int page,
             int pageSize)
        {
            var query = _context.Orders
                .AsNoTracking()
                .Include(o => o.Customer)
                .GroupBy(o => new
                {
                    o.CustomerId,
                    o.Customer.FirstName,
                    o.Customer.LastName,
                    o.Customer.Email,
                    o.Customer.PhoneNumber
                })
                .Select(g => new CustomerReport
                {
                    CustomerId = g.Key.CustomerId,
                    FullName = g.Key.FirstName + " " + g.Key.LastName,
                    Email = g.Key.Email,
                    PhoneNumber = g.Key.PhoneNumber,
                    OrderCount = g.Count()
                })
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(name))
                query = query.Where(c => c.FullName.Contains(name));

            if (!string.IsNullOrWhiteSpace(email))
                query = query.Where(c => c.Email.Contains(email));

            if (minOrders.HasValue)
                query = query.Where(c => c.OrderCount >= minOrders.Value);

            var total = await query.CountAsync();

            var items = await query
                .OrderByDescending(c => c.OrderCount)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<CustomerReport>
            {
                Items = items,
                TotalCount = total,
                PageNumber = page,
                PageSize = pageSize
            };
        }

        public async Task<PagedResult<CustomerSatisfactionReport>> GetCustomerSatisfactionReportAsync(string? name, string? email, SatisfactionLevel? level, int page, int pageSize)
        {
            var query =
                from s in _context.OrderSatisfactions
                join o in _context.Orders on s.OrderId equals o.Id
                join c in _context.Customers on s.CustomerId equals c.Id
                select new CustomerSatisfactionReport
                {
                    OrderId = s.OrderId,
                    CustomerId = c.Id,
                    FullName = c.FirstName + " " + c.LastName,
                    Email = c.Email,
                    Score = s.Score,
                    Level = SatisfactionClassifier.FromScore(s.Score),
                    CreatedAt = s.CreatedAt
                };

            if (!string.IsNullOrWhiteSpace(name))
                query = query.Where(x => x.FullName.Contains(name));

            if (!string.IsNullOrWhiteSpace(email))
                query = query.Where(x => x.Email.Contains(email));

            if (level.HasValue)
                query = query.Where(x => x.Level == level);

            var total = await query.CountAsync();

            var items = await query
                .OrderByDescending(x => x.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<CustomerSatisfactionReport>
            {
                Items = items,
                TotalCount = total,
                PageNumber = page,
                PageSize = pageSize
            };
        }

        public async Task<PagedResult<CustomerStatusReport>> GetCustomerStatusReportAsync(string? name, string? email, CustomerStatus? status, int page, int pageSize)
        {
            var query =
                from c in _context.Customers
                join o in _context.Orders on c.Id equals o.CustomerId into orders
                select new CustomerStatusReport
                {
                    CustomerId = c.Id,
                    FullName = c.FirstName + " " + c.LastName,
                    Email = c.Email,
                    PhoneNumber = c.PhoneNumber,
                    OrderCount = orders.Count(),
                    Status =
                        orders.Any()
                            ? CustomerStatus.Active
                            : CustomerStatus.Inactive
                };

            if (!string.IsNullOrWhiteSpace(name))
                query = query.Where(x => x.FullName.Contains(name));

            if (!string.IsNullOrWhiteSpace(email))
                query = query.Where(x => x.Email.Contains(email));

            if (status.HasValue)
                query = query.Where(x => x.Status == status);

            var total = await query.CountAsync();

            var items = await query
                .OrderByDescending(x => x.OrderCount)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<CustomerStatusReport>
            {
                Items = items,
                TotalCount = total,
                PageNumber = page,
                PageSize = pageSize
            };
        }

        public async Task<PagedResult<ModifiedCanceledOrderReport>> GetModifiedOrCanceledAsync(string? customerName, DateTime? dateFrom, DateTime? dateTo, OrderStatus? status, int page, int pageSize)
        {
            var query = _context.Orders
                .Include(o => o.Customer)
                .Where(o =>
                    o.Status == OrderStatus.Canceled ||
                    o.Status == OrderStatus.Pending ||
                    o.Status == OrderStatus.PendingResolution ||
                    o.Status == OrderStatus.PendingReissued ||
                    o.Status == OrderStatus.ReIssued
                );

            if (!string.IsNullOrWhiteSpace(customerName))
                query = query.Where(o =>
                    (o.Customer.FirstName + " " + o.Customer.LastName)
                    .Contains(customerName));

            if (dateFrom.HasValue)
                query = query.Where(o =>
                    (o.ModifiedStatusDate ?? o.OrderDate) >= dateFrom.Value);

            if (dateTo.HasValue)
                query = query.Where(o =>
                    (o.ModifiedStatusDate ?? o.OrderDate) <= dateTo.Value);

            if (status.HasValue)
                query = query.Where(o => o.Status == status);

            var total = await query.CountAsync();

            var data = await query
                .OrderByDescending(o => o.ModifiedStatusDate ?? o.OrderDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(o => new ModifiedCanceledOrderReport
                {
                    OrderId = o.Id,
                    CustomerFullName = o.Customer.FirstName + " " + o.Customer.LastName,
                    OrderDate = o.OrderDate,
                    ModifiedDate = o.ModifiedStatusDate,
                    Status = o.Status
                })
                .ToListAsync();

            return new PagedResult<ModifiedCanceledOrderReport>
            {
                Items = data,
                TotalCount = total,
                PageNumber = page,
                PageSize = pageSize
            };
        }

        



    }
}
