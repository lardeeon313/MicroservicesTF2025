using DepotService.Application.DTOs;
using DepotService.Application.DTOs.DepotOrder;
using DepotService.Domain.Entities;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.BillingManager.GetInvoicedOrdersByCustomer
{
    public class GetInvoicedOrdersByCustomerQueryHandler(DepotDbContext context, IDepotOrderRepository repository, ILogger<GetInvoicedOrdersByCustomerQueryHandler> logger) : IGetInvoicedOrdersByCustomerQueryHandler
    {
        private readonly DepotDbContext _context = context;
        private readonly IDepotOrderRepository _repository = repository;
        private readonly ILogger<GetInvoicedOrdersByCustomerQueryHandler> _logger = logger;

        /// <summary>
        /// Handler for retrieving invoiced orders by customer (Id or Name).
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        public async Task<List<DepotOrderDto>> GetInvoicedOrdersByCustomerAsync(GetInvoicedOrdersByCustomerQuery query)
        {
            if (string.IsNullOrWhiteSpace(query.CustomerName))
            {
                throw new ArgumentException("Debe especificar el nombre del cliente.");
            }

            var ordersByCustomer = _context.DepotOrders
                .Where(o => o.CustomerName.Contains(query.CustomerName))
                .ToList();

            if (!ordersByCustomer.Any())
            {
                _logger.LogWarning("No invoiced orders found for customer with Name {CustomerName}.", query.CustomerName);
                throw new KeyNotFoundException($"No invoiced orders found for customer with Name {query.CustomerName}.");
            }

            _logger.LogInformation("Found {Count} invoiced orders for customer with Name {CustomerName}.", ordersByCustomer.Count(), query.CustomerName);

            return ordersByCustomer.Select(o => new DepotOrderDto
            {
                DepotOrderId = o.DepotOrderId,
                SalesOrderId = o.SalesOrderId,
                CustomerName = o.CustomerName,
                CustomerEmail = o.CustomerEmail,
                TotalAmount = o.TotalAmount,
                Status = o.Status,
                Items = o.Items.Select(i => new DepotOrderItemDto
                {
                    Id = i.Id,
                    ProductBrand = i.ProductBrand,
                    ProductName = i.ProductName,
                    Packaging = i.PackagingType,
                    Quantity = i.Quantity,
                    Total = i.UnitPrice.HasValue ? i.UnitPrice.Value * i.Quantity : 0,
                }).ToList(),
                PhoneNumber = o.PhoneNumber,
                DeliveryDetail = o.DeliveryDetail,
                OrderDate = o.OrderDate,
            }).ToList();
        }
    }
}
