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

namespace DepotService.Application.Queries.DepotManager.GetAllOrders
{
    public class GetAllOrdersQueryHandler(IDepotOrderRepository repository, ILogger<GetAllOrdersQueryHandler> logger) : IGetAllOrdersQueryHandler
    {
        private readonly IDepotOrderRepository _repository = repository;
        private readonly ILogger<GetAllOrdersQueryHandler> _logger = logger;

        /// <summary>
        /// Handler para obtener todas las órdenes en el depósito.
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<DepotOrderDto?>> AllOrdersHandleAsync()
        {
            var orders = await _repository.GetAllAsync();

            if (orders == null || !orders.Any())
            {
                _logger.LogWarning("No orders found in the depot.");
                return Enumerable.Empty<DepotOrderDto>();
            }

            _logger.LogInformation("Retrieved {Count} orders from the depot.", orders.Count());

            return orders.Select(order => new DepotOrderDto
            {
                DepotOrderId = order.DepotOrderId,
                SalesOrderId = order.SalesOrderId,
                CustomerName = order.CustomerName,
                CustomerEmail = order.CustomerEmail,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                Items = order.Items.Select(item => new DepotOrderItemDto
                {
                    Id = item.Id,
                    ProductBrand = item.ProductBrand,
                    ProductName = item.ProductName,
                    Packaging = item.PackagingType,
                    Quantity = item.Quantity,
                    Total = item.UnitPrice.HasValue ? item.UnitPrice.Value * item.Quantity : 0,
                }).ToList(),
                PhoneNumber = order.PhoneNumber,
                DeliveryDetail = order.DeliveryDetail,
                OrderDate = order.OrderDate,
                Address = new OrderAddressDto
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
                }
            });
        }
    }
}
