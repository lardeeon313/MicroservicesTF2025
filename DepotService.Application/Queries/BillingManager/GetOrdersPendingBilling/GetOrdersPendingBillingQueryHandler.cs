using DepotService.Application.DTOs;
using DepotService.Application.DTOs.DepotOrder;
using DepotService.Domain.Entities;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.BillingManager.GetOrdersPendingBilling
{
    public class GetOrdersPendingBillingQueryHandler(DepotDbContext context, IDepotOrderRepository repository, ILogger<GetOrdersPendingBillingQueryHandler> logger) : IGetOrdersPendingBillingQueryHandler
    {
        private readonly DepotDbContext _context = context;
        private readonly IDepotOrderRepository _repository = repository;
        private readonly ILogger<GetOrdersPendingBillingQueryHandler> _logger = logger;

        public async Task<List<DepotOrderDto>> HandleAsync()
        {
            var orders = await _repository.GetOrdersPendingBillingAsync();
            if (orders == null || !orders.Any())
            {
                _logger.LogWarning("No pending billing orders found.");
                throw new KeyNotFoundException("No pending billing orders found.");
            }

            _logger.LogInformation("Found {Count} pending billing orders.", orders.Count());

            return orders.Select(o => new DepotOrderDto
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
