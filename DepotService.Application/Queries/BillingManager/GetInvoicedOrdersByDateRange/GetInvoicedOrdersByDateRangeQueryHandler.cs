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

namespace DepotService.Application.Queries.BillingManager.GetInvoicedOrdersByDateRange
{
    public class GetInvoicedOrdersByDateRangeQueryHandler(IDepotOrderRepository repository, ILogger<GetInvoicedOrdersByDateRangeQueryHandler> logger): IGetInvoicedOrdersByDateRangeQueryHandler
    {        
        private readonly IDepotOrderRepository _repository = repository;
        private readonly ILogger<GetInvoicedOrdersByDateRangeQueryHandler> _logger = logger;

        /// <summary>
        /// Handler for retrieving invoiced orders within a specified date range.
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<List<DepotOrderDto>> GetInvoicedOrdersByDateRangeAsync(GetInvoicedOrdersByDateRangeQuery query)
        {
            var invoicedOrders = await _repository.GetInvoicedOrdersByDateRangeAsync(query.StartDate, query.EndDate);

            if (invoicedOrders == null || !invoicedOrders.Any())
            {
                _logger.LogWarning("No invoiced orders found for the specified date range.");
                return new List<DepotOrderDto>();
            }

            _logger.LogInformation("Found {Count} invoiced orders in the date range from {StartDate} to {EndDate}.", invoicedOrders.Count(), query.StartDate, query.EndDate);

            return invoicedOrders.Select(o => new DepotOrderDto
            {
                DepotOrderId = o.DepotOrderId,
                SalesOrderId = o.SalesOrderId,
                CustomerName = o.CustomerName,
                CustomerEmail = o.CustomerEmail,
                TotalAmount = o.TotalAmount,
                Status = o.Status,
                Address = new OrderAddressDto
                {
                    Street = o.DeliveryAddress.Street,
                    Number = o.DeliveryAddress.Number,
                    Apartment = o.DeliveryAddress.Apartment,
                    City = o.DeliveryAddress.City,
                    Province = o.DeliveryAddress.Province,
                    Country = o.DeliveryAddress.Country,
                    PostalCode = o.DeliveryAddress.PostalCode,
                    Latitude = o.DeliveryAddress.Latitude,
                    Longitude = o.DeliveryAddress.Longitude,
                    FormattedAddress = o.DeliveryAddress.FormattedAddress
                },
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
