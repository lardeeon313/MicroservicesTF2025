using LogisticService.Application.DTOs;
using LogisticService.Application.DTOs.DeliveryZoneDtos;
using LogisticService.Application.DTOs.LogisticOrderDtos;
using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetAllOrders
{
    public class GetAllOrdersQueryHandler(ILogisticOrderRepository repository, ILogger<GetAllOrdersQueryHandler> logger) : IGetAllOrdersQueryHandler
    {
        private readonly ILogisticOrderRepository _repository = repository;
        private readonly ILogger<GetAllOrdersQueryHandler> _logger = logger;

        /// <summary>
        /// Query para obtener todas las órdenes logísticas.
        /// </summary>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<IEnumerable<LogisticOrderDto>> GetAllHandleAsync()
        {
            var orders = await _repository.GetAllAsync();

            if (!orders.Any())
            {
                _logger.LogWarning("No logistic orders found.");
                return Enumerable.Empty<LogisticOrderDto>();
            }

            return orders.Select(order => new LogisticOrderDto
            {
                Id = order.Id,
                Status = order.Status,
                DeliveryPriority = order.DeliveryPriority,
                OrderDate = order.OrderDate,
                DeliveryDate = order.DeliveryDate,
                ModifiedStatusDate = order.ModifiedStatusDate,
                TotalAmount = order.TotalAmount,
                PaymentReceipt = order.PaymentReceipt,
                DeliveryDetail = order.DeliveryDetail,
                PaymentType = order.PaymentType,
                Customer = order.Customer == null ? null : new()
                {
                    Id = order.Customer.Id,
                    FirstName = order.Customer.FirstName,
                    LastName = order.Customer.LastName,
                    Email = order.Customer.Email,
                    PhoneNumber = order.Customer.PhoneNumber
                },
                Items = order.Items.Select(item => new LogisticOrderItemDto
                {
                    Id = item.Id,
                    ProductName = item.ProductName,
                    ProductBrand = item.ProductBrand,
                    Quantity = item.Quantity,
                    Total = item.Total,
                    PackagingType = item.PackagingType,
                    UnitPrice = item.UnitPrice
                }).ToList(),
                AssignedOperatorId = order.AssignedOperatorId,
                AssignedDeliveryZone = new DeliveryZoneDto
                {
                    Name = order.AssignedDeliveryZone?.Name ?? string.Empty,
                    Description = order.AssignedDeliveryZone?.Description ?? string.Empty
                },
                AssignedDeliveryTeam = new DeliveryTeamDto
                {
                    TeamName = order.AssignedDeliveryTeam?.TeamName ?? string.Empty,
                    TeamDescription = order.AssignedDeliveryTeam?.TeamDescription ?? string.Empty
                },
                DeliveryAddress = new LogisticAddressDto
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
            }).ToList();
        }
    }
}
