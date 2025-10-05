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

namespace DepotService.Application.Queries.Operator.GetAssignedPendingOrders
{
    public class GetAssignedPendingOrdersQueryHandler(IDepotOrderRepository repository, DepotDbContext context, ILogger<GetAssignedPendingOrdersQueryHandler> logger) : IGetAssignedPendingOrdersQueryHandler
    {
        private readonly IDepotOrderRepository _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        private readonly DepotDbContext _context = context ?? throw new ArgumentNullException(nameof(context));
        private readonly ILogger<GetAssignedPendingOrdersQueryHandler> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        /// <summary>
        /// Handler para obtener los pedidos pendientes asignados a un operador del depósito.
        /// </summary>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<List<DepotOrderDto>> GetAssignedPendingOrders()
        {
            var orders = await _repository.GetAssignedPendingOrdersByOperatorIdAsync();
            if (orders == null)
            {
                _logger.LogWarning("No pending orders found for the operator.");
                throw new KeyNotFoundException(nameof(orders));
            }

            _logger.LogInformation("Found {Count} pending orders for the operator.", orders.Count());

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
                Address = new OrderAddressDto
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
                AssignedDepotTeam = o.AssignedDepotTeam,
            }).ToList();
        }
    }
}
