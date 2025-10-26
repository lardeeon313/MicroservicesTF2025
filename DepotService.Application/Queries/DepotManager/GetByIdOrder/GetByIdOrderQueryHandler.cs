using DepotService.Application.DTOs;
using DepotService.Application.DTOs.DepotOrder;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.DepotManager.GetByIdOrder
{
    public class GetByIdOrderQueryHandler(IDepotOrderRepository repository, ILogger<GetByIdOrderQueryHandler> logger) : IGetByIdOrderQueryHandler
    {
        private readonly IDepotOrderRepository _repository = repository;        
        private readonly ILogger<GetByIdOrderQueryHandler> _logger = logger;
        public async Task<DepotOrderDto?> GetByIdOrderHandler(int depotOrderId)
        {
            var orderExist = await _repository.GetByIdAsync(depotOrderId);

            if (orderExist == null)
            {
                _logger.LogError($"Order with ID {depotOrderId} not found.");
                return null;
            }

            var orderDto = new DepotOrderDto
            {
                DepotOrderId = orderExist.DepotOrderId,
                SalesOrderId = orderExist.SalesOrderId,
                CustomerName = orderExist.CustomerName,
                CustomerEmail = orderExist.CustomerEmail,
                PhoneNumber = orderExist.PhoneNumber,
                DeliveryDetail = orderExist.DeliveryDetail,
                OrderDate = orderExist.OrderDate,
                Status = orderExist.Status,
                Items = orderExist.Items.Select(i => new DepotOrderItemDto
                {
                    Id = i.Id,
                    ProductBrand = i.ProductBrand,
                    ProductName = i.ProductName,
                    Packaging = i.PackagingType,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    Total = i.UnitPrice.HasValue ? i.UnitPrice.Value * i.Quantity : 0
                }).ToList(),
                Missings = orderExist.Missings,
                AssignedDepotTeam = orderExist.AssignedDepotTeam,
                Address = orderExist.DeliveryAddress == null
                ? null
                : new OrderAddressDto
                {
                    Street = orderExist.DeliveryAddress.Street,
                    Number = orderExist.DeliveryAddress.Number,
                    Apartment = orderExist.DeliveryAddress.Apartment,
                    City = orderExist.DeliveryAddress.City,
                    Province = orderExist.DeliveryAddress.Province,
                    Country = orderExist.DeliveryAddress.Country,
                    PostalCode = orderExist.DeliveryAddress.PostalCode,
                    Latitude = orderExist.DeliveryAddress.Latitude,
                    Longitude = orderExist.DeliveryAddress.Longitude,
                    FormattedAddress = orderExist.DeliveryAddress.FormattedAddress
                }
            };
            _logger.LogInformation($"Order with ID {depotOrderId} retrieved successfully.");
            return orderDto;
        }
    }
}
