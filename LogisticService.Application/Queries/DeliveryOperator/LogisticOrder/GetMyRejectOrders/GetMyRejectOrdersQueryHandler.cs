
using LogisticService.Application.DTOs;
using LogisticService.Application.DTOs.DeliveryZoneDtos;
using LogisticService.Application.DTOs.LogisticOrderDtos;
using LogisticService.Application.Queries.DeliveryOperator.LogisticOrder.GetMyOrdersWithDeliveryIncident;
using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.DeliveryOperator.LogisticOrder.GetMyRejectOrders
{
    public class GetMyRejectOrdersQueryHandler(ILogisticOrderRepository repository, ILogger<GetMyRejectOrdersQueryHandler> logger) : IGetMyRejectOrdersQueryHandler
    {
        private readonly ILogisticOrderRepository _repository = repository;
        private readonly ILogger<GetMyRejectOrdersQueryHandler> _logger = logger;

        /// <summary>
        /// Query para devolver las ordenes rechazadas por un operario.
        /// </summary>
        /// <param name="OperatorUserId"></param>
        /// <returns></returns>        
        public async Task<List<LogisticOrderDto>> GetMyRejectOrdersAsync(Guid OperatorUserId)
        {
            var orders = await _repository.GetMyRejectOrders(OperatorUserId);
            if (orders == null)
            {
                _logger.LogWarning("No RejectionOrders found for operator {OperatorId}", OperatorUserId);
                return new List<LogisticOrderDto>();
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
                DeliveryRejections = order.RejectionReasons.Select(rejection => new DeliveryRejectionReasonDto
                {
                    Id = rejection.Id,
                    Reason = rejection.Reason,
                    DeliveryOperatorId = rejection.DeliveryOperatorId,
                    RejectedAt = rejection.RejectedAt,
                }).ToList(),
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
