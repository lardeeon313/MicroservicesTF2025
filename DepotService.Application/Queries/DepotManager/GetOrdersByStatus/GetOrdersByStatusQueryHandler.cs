using DepotService.Application.DTOs;
using DepotService.Application.DTOs.DepotOrder;
using DepotService.Domain.Entities;
using DepotService.Domain.Enums;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.DepotManager.GetOrdersByStatus
{
    public class GetOrdersByStatusQueryHandler(IDepotOrderRepository repository, ILogger<GetOrdersByStatusQueryHandler> logger) : IGetOrdersByStatusQueryHandler
    {
        private readonly IDepotOrderRepository _repository = repository;        
        private readonly ILogger<GetOrdersByStatusQueryHandler> _logger = logger;

        /// <summary>
        /// Handler para devolver órdenes por su estado.
        /// </summary>
        /// <param name="status"></param>
        /// <returns></returns>
        public async Task<IEnumerable<DepotOrderDto>> GetOrderByStatusHandlerAsync(string status)
        {
            try
            {
                if (!Enum.TryParse<OrderStatus>(status, true, out var parsedStatus))
                    throw new ArgumentException($"Invalid order status: {status}");

                var orders = await _repository.GetOrderByStatusAsync(parsedStatus.ToString());
                
                if (!orders.Any())
                    return Enumerable.Empty<DepotOrderDto>();

                var OrderDtos = orders.Select(order => new DepotOrderDto
                {
                    DepotOrderId = order.DepotOrderId,
                    SalesOrderId = order.SalesOrderId,
                    CustomerName = order.CustomerName,
                    CustomerEmail = order.CustomerEmail,
                    PhoneNumber = order.PhoneNumber,
                    DeliveryDetail = order.DeliveryDetail,
                    OrderDate = order.OrderDate,
                    Status = order.Status,
                    RejectionReason = order.RejectionReason,
                    Items = order.Items.Select(i => new DepotOrderItemDto
                    {
                        Id = i.Id,
                        ProductBrand = i.ProductBrand,
                        ProductName = i.ProductName,
                        Packaging = i.PackagingType,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice,
                        Total = i.UnitPrice.HasValue ? i.UnitPrice.Value * i.Quantity : 0,
                    }).ToList(),
                    Missings = order.Missings,
                    AssignedDepotTeam = order.AssignedDepotTeam,
                    AssignedOperatorId = order.AssignedOperatorId,
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
                    }
                });

                _logger.LogInformation("Orders retrieved successfully for status: {Status}", status);

                return OrderDtos;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving orders by status: {Status}", status);
                throw;
            }

        }
    }
}
