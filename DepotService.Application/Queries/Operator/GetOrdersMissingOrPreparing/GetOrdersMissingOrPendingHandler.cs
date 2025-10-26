using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DepotService.Application.DTOs;
using DepotService.Application.DTOs.DepotOrder;
using DepotService.Application.Queries.Operator.GetOrdersByOperatorQuery;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.Extensions.Logging;
using GetOrdersQuery = DepotService.Application.Queries.Operator.GetOrdersByOperatorQuery.GetOrdersByOperatorQuery;

namespace DepotService.Application.Queries.Operator.IGetOrdersMissingOrPreparing
{
    public class GetOrdersMissingOrPreparingHandler(IDepotOrderRepository repository, ILogger<GetOrdersMissingOrPreparingHandler> logger) : IGetOrdersMissingOrPreparingHandler
    {
        private readonly IDepotOrderRepository _repository = repository;        
        private readonly ILogger<GetOrdersMissingOrPreparingHandler> _logger = logger;

        public async Task<IEnumerable<DepotOrderDto>> GetOrdersMissingByOperatorAsync(GetOrdersQuery query)
        {
            var orders = await _repository.GetWithInPreparationOrMissingAsync(query.OperatorUserId);
            if (orders == null || !orders.Any())
            {
                _logger.LogWarning("No orders found for operator {OperatorUserId}", query.OperatorUserId);
                return Enumerable.Empty<DepotOrderDto>();
            }
            _logger.LogInformation("Found {Count} orders for operator {OperatorUserId}", orders.Count(), query.OperatorUserId);

            //Lo devuelve
            return orders.Select(o => new DepotOrderDto
            {
                DepotOrderId = o.DepotOrderId,
                SalesOrderId = o.SalesOrderId,
                Status = o.Status,
                CustomerName = o.CustomerName,
                CustomerEmail = o.CustomerEmail,
                PhoneNumber = o.PhoneNumber,
                DeliveryDetail = o.DeliveryDetail,
                OrderDate = o.OrderDate,
                Address = o.DeliveryAddress == null
                ? null
                : new OrderAddressDto
                {
                    Street = o.DeliveryAddress.Street,
                    Number = o.DeliveryAddress.Number,
                    Apartment = o.DeliveryAddress.Apartment,
                    City = o.DeliveryAddress.City,
                    Province = o.DeliveryAddress.Province,
                    Country = o.DeliveryAddress.Country,
                    PostalCode = o.DeliveryAddress.PostalCode,
                    Latitude = o.DeliveryAddress.Latitude,
                    Longitude = o.DeliveryAddress.Longitude,
                    FormattedAddress = o.DeliveryAddress.FormattedAddress
                },
                Items = o.Items.Select(i => new DepotOrderItemDto
                {
                    Id = i.Id,
                    ProductBrand = i.ProductBrand,
                    ProductName = i.ProductName,
                    Packaging = i.PackagingType,
                    Quantity = i.Quantity,
                }).ToList(),

            }).ToList();

        }
    }
}
