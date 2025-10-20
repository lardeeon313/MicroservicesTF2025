using DepotService.Application.DTOs;
using DepotService.Application.DTOs.DepotOrder;
using DepotService.Domain.Entities;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.Operator.GetOrderById
{
    public class GetOrderByIdQueryHandler(IDepotOrderRepository repository, ILogger<GetOrderByIdQueryHandler> logger) : IGetOrderByIdQueryHandler
    {        
        private readonly IDepotOrderRepository _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        private readonly ILogger<GetOrderByIdQueryHandler> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        /// <summary>
        /// handler para obtener una orden por su ID asociada a un operador específico.
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>        
        public async Task<DepotOrderDto?> GetOrderByIdHandler(GetOrderByIdQuery query)
        {
            var order = await _repository.GetByIdAsync(query.DepotOrderId);

            if (order == null)
            {
                _logger.LogError($"Order with ID {query.DepotOrderId} not found.");
                return null;
            }

            if (order.AssignedOperatorId != query.OperatorUserId)
            {
                _logger.LogError($"Order with ID {query.DepotOrderId} is not assigned to operator {query.OperatorUserId}.");
                throw new InvalidOperationException($"Order with ID {query.DepotOrderId} is not assigned to operator {query.OperatorUserId}.");
            }

            return new DepotOrderDto
            {
                DepotOrderId = order.DepotOrderId,
                SalesOrderId = order.SalesOrderId,
                CustomerName = order.CustomerName,
                CustomerEmail = order.CustomerEmail,
                PhoneNumber = order.PhoneNumber,
                Status = order.Status,
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
                },
                AssignedDepotTeam = order.AssignedDepotTeam,
                Missings = order.Missings?.Select(m => new DepotOrderMissing
                {
                    MissingId = m.MissingId,
                    SalesOrderId = m.SalesOrderId,
                    MissingReason = m.MissingReason,
                    MissingDescription = m.MissingDescription,
                    DescriptionResolution = m.DescriptionResolution,
                    MissingItems = m.MissingItems?.Select(mi => new DepotOrderMissingItem
                    {
                        Id = mi.Id,
                        ProductName = mi.ProductName,
                        ProductBrand = mi.ProductBrand,
                        Packaging = mi.Packaging,
                        MissingQuantity = mi.MissingQuantity,
                    }).ToList() ?? new List<DepotOrderMissingItem>(),
                    MissingDate = m.MissingDate,
                    DepotOrderId = m.DepotOrderId,
                }).ToList() ?? new List<DepotOrderMissing>(),
                AssignedOperatorId = order.AssignedOperatorId,
                DeliveryDetail = order.DeliveryDetail,
                OrderDate = order.OrderDate,
                Items = order.Items?.Select(i => new DepotOrderItemDto
                {
                    Id = i.Id,
                    ProductBrand = i.ProductBrand,
                    ProductName = i.ProductName,
                    Packaging = i.PackagingType,
                    Quantity = i.Quantity,
                    IsReady = i.IsReady,
                }).ToList() ?? new List<DepotOrderItemDto>(),
            };
        }
    }
}
