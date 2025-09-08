using Microsoft.Extensions.Logging;
using SalesService.Application.DTOs.Order;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Orders.GetAllMissingOrders
{
    public class GetAllMissingOrdersQueryHandler(IOrderRepository repository, ILogger<GetAllMissingOrdersQueryHandler> logger) : IGetAllMissingOrdersQueryHandler
    {
        private readonly IOrderRepository _repository = repository;
        private readonly ILogger<GetAllMissingOrdersQueryHandler> _logger = logger;

        /// <summary>
        /// Handler para obtener todas las órdenes faltantes.
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<OrderMissingDto>> GetAllMissingOrdersAsync()
        {
            var ordersMissing = await _repository.GetMissingOrdersAsync();

            if (ordersMissing == null || !ordersMissing.Any())
            {
                _logger.LogInformation("No missing orders found.");
                return Enumerable.Empty<OrderMissingDto>();
            }

            return ordersMissing.Select(order => new OrderMissingDto
            {
                MissingId = order.Id,
                DepotOrderId = order.DepotOrderId,
                SalesOrderId = order.OrderId,
                MissingReason = order.MissingReason,
                MissingDescription = order.MissingDescription,
                DescriptionResolution = order.DescriptionResolution,
                MissingDate = order.MissingDate,
                SalesOrder = new OrderDto
                {
                    Id = order.Order.Id,
                    CustomerId = order.Order.CustomerId,
                    CustomerFirstName = order.Order.Customer.FirstName,
                    CustomerLastName = order.Order.Customer.LastName,
                    DeliveryDate = order.Order.DeliveryDate,
                    DeliveryDetail = order.Order.DeliveryDetail,
                    OrderDate = order.Order.OrderDate,
                    Status = order.Order.Status,
                    CreatedByUserId = order.Order.CreatedByUserId,
                    Items = order.Order.Items.Select(i => new OrderItemDto
                    {
                        Id = i.Id,
                        ProductName = i.ProductName,
                        ProductBrand = i.ProductBrand,
                        Quantity = i.Quantity
                    }).ToList()
                },
                MissingItems = order.MissingItems.Select(missingItem => new OrderMissingItemDto
                {
                    Id = missingItem.Id,
                    OrderItemId = missingItem.OrderItemId,
                    ProductName = missingItem.ProductName,
                    ProductBrand = missingItem.ProductBrand,
                    Packaging = missingItem.Packaging,
                    MissingQuantity = missingItem.MissingQuantity,
                }).ToList(),
            });

        }
    }
}
