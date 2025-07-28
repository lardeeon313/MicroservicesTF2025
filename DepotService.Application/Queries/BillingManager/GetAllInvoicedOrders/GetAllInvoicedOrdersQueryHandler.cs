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

namespace DepotService.Application.Queries.BillingManager.GetAllInvoicedOrders
{
    public class GetAllInvoicedOrdersQueryHandler(IDepotOrderRepository repository, DepotDbContext context, ILogger<GetAllInvoicedOrdersQueryHandler> logger) : IGetAllInvoicedOrdersQueryHandler
    {
        private readonly IDepotOrderRepository _repository = repository;
        private readonly DepotDbContext _context = context;
        private readonly ILogger<GetAllInvoicedOrdersQueryHandler> _logger = logger;

        /// <summary>
        /// Handler para obtener todos los pedidos facturados en el sistema de gestión de depósitos.
        /// </summary>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<List<DepotOrderDto>> GetAllInvoicedOrdersAsync()
        {
            var invoicedOrders = await _repository.GetAllInvoicedOrdersAsync();

            if (invoicedOrders == null || !invoicedOrders.Any())
            {
                _logger.LogWarning("No invoiced orders found.");
                throw new KeyNotFoundException("No invoiced orders found.");
            }

            _logger.LogInformation("Found {Count} invoiced orders.", invoicedOrders.Count());

            return invoicedOrders.Select(o => new DepotOrderDto
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
