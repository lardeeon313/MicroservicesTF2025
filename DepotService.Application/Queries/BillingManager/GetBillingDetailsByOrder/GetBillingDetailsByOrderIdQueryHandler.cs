using DepotService.Application.DTOs;
using DepotService.Application.DTOs.DepotOrder;
using DepotService.Domain.Entities;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.BillingManager.GetBillingDetailsByOrder
{
    public class GetBillingDetailsByOrderIdQueryHandler(IDepotOrderRepository repository, ILogger<GetBillingDetailsByOrderIdQueryHandler> logger) : IGetBillingDetailsByOrderIdQueryHandler
    {
        private readonly IDepotOrderRepository _repository = repository;        
        private readonly ILogger<GetBillingDetailsByOrderIdQueryHandler> _logger = logger;

        /// <summary>
        /// Handles the query to get billing details by order ID.
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        public async Task<DepotOrderDto?> GetBillingDetailsByOrderIdAsync(GetBillingDetailsByOrderIdQuery query)
        {
            var order = await _repository.GetByIdAsync(query.DepotOrderId);
            if (order == null)
            {
                _logger.LogWarning("Order with ID {OrderId} not found.", query.DepotOrderId);
                return null;
            }

            _logger.LogInformation("Retrieved billing details for order ID {OrderId}.", query.DepotOrderId);

            return new DepotOrderDto
            {
                DepotOrderId = order.DepotOrderId,
                SalesOrderId = order.SalesOrderId,
                CustomerName = order.CustomerName,
                CustomerEmail = order.CustomerEmail,
                PhoneNumber = order.PhoneNumber,
                TotalAmount = order.TotalAmount,
                DeliveryDetail = order.DeliveryDetail,
                OrderDate = order.OrderDate,
                Status = order.Status,
                Address = order.DeliveryAddress == null
                ? null
                : new OrderAddressDto
                {
                    Street = order.DeliveryAddress.Street,
                    Number = order.DeliveryAddress.Number,
                    Apartment = order.DeliveryAddress.Apartment,
                    City = order.DeliveryAddress.City,
                    Province = order.DeliveryAddress.Province,
                    Country = order.DeliveryAddress.Country,
                    PostalCode = order.DeliveryAddress.PostalCode,
                    Latitude = order.DeliveryAddress.Latitude,
                    Longitude = order.DeliveryAddress.Longitude,
                    FormattedAddress = order.DeliveryAddress.FormattedAddress
                },
                Items = order.Items.Select(i => new DepotOrderItemDto
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
