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
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace LogisticService.Application.Queries.DeliveryOperator.LogisticOrder.GetMyPendingDeliveredOrders
{
    public class GetMyPendingDeliveredOrdersQueryHandler(ILogisticOrderRepository repository, ILogger<GetMyPendingDeliveredOrdersQueryHandler> logger) : IGetMyPendingDeliveredOrdersQueryHandler
    {
        private readonly ILogisticOrderRepository _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        private readonly ILogger<GetMyPendingDeliveredOrdersQueryHandler> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        /// <summary>
        /// Query para obtener los pedidos pendientes de entrega de un operador de logística.
        /// </summary>
        /// <param name="operatorUserId"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<List<LogisticOrderDto>> GetMyPendingDeliveredOrdersAsync(GetMyPendingDeliveredOrdersQuery query)
            {
                var orders = await _repository.GetMyPendingDeliveredOrders(query.OperatorUserId);
            if (orders == null || !orders.Any())
            {
                _logger.LogWarning("No pending delivery orders found for operator {OperatorId}", query.OperatorUserId);
                return new List<LogisticOrderDto>();
            }

            _logger.LogInformation("Found {Count} pending delivery orders for operator {OperatorId}", orders.Count(), query.OperatorUserId);

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
