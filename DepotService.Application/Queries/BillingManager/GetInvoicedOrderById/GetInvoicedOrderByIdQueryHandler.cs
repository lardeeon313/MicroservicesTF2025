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

namespace DepotService.Application.Queries.BillingManager.GetInvoicedOrderById
{
    public class GetInvoicedOrderByIdQueryHandler(IDepotOrderRepository repository, ILogger<GetInvoicedOrderByIdQueryHandler> logger) : IGetInvoicedOrderByIdQueryHandler
    {        
        private readonly IDepotOrderRepository _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        private readonly ILogger<GetInvoicedOrderByIdQueryHandler> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        /// <summary>
        /// Handler for the query to get an invoiced order by its ID.
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>        
        public async Task<DepotOrderDto?> GetInvoicedOrderByIdAsync(GetInvoicedOrderByIdQuery query)
        {
            var billingOrderId = await _repository.GetByIdAsync(query.BillingOrderId);

            if (billingOrderId == null)
            {
                _logger.LogWarning("Invoiced order with ID {BillingOrderId} not found.", query.BillingOrderId);
                return null;
            }

            _logger.LogInformation("Retrieved invoiced order with ID {BillingOrderId}.", query.BillingOrderId);

            return new DepotOrderDto
            {
                DepotOrderId = billingOrderId.DepotOrderId,
                SalesOrderId = billingOrderId.SalesOrderId,
                CustomerName = billingOrderId.CustomerName,
                CustomerEmail = billingOrderId.CustomerEmail,
                PhoneNumber = billingOrderId.PhoneNumber,
                TotalAmount = billingOrderId.TotalAmount,
                DeliveryDetail = billingOrderId.DeliveryDetail,
                OrderDate = billingOrderId.OrderDate,
                Status = billingOrderId.Status,
                Address = billingOrderId.DeliveryAddress == null
                ? null
                : new OrderAddressDto
                {
                    Street = billingOrderId.DeliveryAddress.Street,
                    Number = billingOrderId.DeliveryAddress.Number,
                    Apartment = billingOrderId.DeliveryAddress.Apartment,
                    City = billingOrderId.DeliveryAddress.City,
                    Province = billingOrderId.DeliveryAddress.Province,
                    Country = billingOrderId.DeliveryAddress.Country,
                    PostalCode = billingOrderId.DeliveryAddress.PostalCode,
                    Latitude = billingOrderId.DeliveryAddress.Latitude,
                    Longitude = billingOrderId.DeliveryAddress.Longitude,
                    FormattedAddress = billingOrderId.DeliveryAddress.FormattedAddress
                },
                Items = billingOrderId.Items.Select(i => new DepotOrderItemDto
                {
                    Id = i.Id,
                    ProductBrand = i.ProductBrand,
                    ProductName = i.ProductName,
                    Packaging = i.PackagingType,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    Total = i.UnitPrice.HasValue ? i.UnitPrice.Value * i.Quantity : 0
                }).ToList(),
            };

        }
    }
}
