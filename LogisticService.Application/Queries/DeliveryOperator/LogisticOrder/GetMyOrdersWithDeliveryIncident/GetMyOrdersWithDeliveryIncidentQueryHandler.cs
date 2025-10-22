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

namespace LogisticService.Application.Queries.DeliveryOperator.LogisticOrder.GetMyOrdersWithDeliveryIncident
{
    public class GetMyOrdersWithDeliveryIncidentQueryHandler(ILogisticOrderRepository repository, ILogger<GetMyOrdersWithDeliveryIncidentQueryHandler> logger) : IGetMyOrdersWithDeliveryIncidentQueryHandler
    {
        private readonly ILogisticOrderRepository _repository = repository;
        private readonly ILogger<GetMyOrdersWithDeliveryIncidentQueryHandler> _logger = logger;

        /// <summary>
        /// Query para devolver las ordenes de un operador que sufrieron una incidencia
        /// </summary>
        /// <param name="operatorUserId"></param>
        /// <returns></returns>        
        public async Task<List<LogisticOrderDto>> GetMyOrdersWithDeliveryIncidentAsync(Guid operatorUserId)
        {
            var orders = await _repository.GetMyOrdersWithDeliveryIncident(operatorUserId);
            if (orders == null)
            {
                _logger.LogWarning("No Orders-with-deliveryIncident found for operator {OperatorId}", operatorUserId);
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
                DeliveryIncidents = order.DeliveryIncidents.Select(incident => new DeliveryIncidentDto
                {
                    Id = incident.Id,
                    IncidentType = incident.IncidentType,
                    Description = incident.Description,
                    ReportedAt = incident.ReportedAt,
                    ReportedByOperatorId = incident.ReportedByOperatorId,
                    Resolved = incident.Resolved,
                    ResolvedAt = incident.ResolvedAt,
                    ResolutionNote = incident.ResolutionNote,
                    DeliveryIncidentStatus = incident.DeliveryIncidentStatus
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
