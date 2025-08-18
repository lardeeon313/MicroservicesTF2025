using DepotService.Application.DTOs.DepotOrder;
using DepotService.Application.Queries.DepotManager.GetMissingOrderById;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.DepotManager.GetAllMissingOrders
{
    public class GetAllMissingOrdersQueryHandler(IDepotOrderRepository repository, ILogger<GetAllMissingOrdersQueryHandler> logger, DepotDbContext context) : IGetAllMissingOrdersQueryHandler
    {
        private readonly IDepotOrderRepository _repository = repository;
        private readonly ILogger<GetAllMissingOrdersQueryHandler> _logger = logger;
        private readonly DepotDbContext _context = context;

        /// <summary>
        /// Handler para devolver todas las órdenes faltantes en el depósito.
        /// </summary>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<IEnumerable<DepotOrderMissingDto>> GetAllMissingOrdersAsync()
        {
            var missingOrders = await _repository.GetMissingOrdersAsync();

            if (missingOrders == null || !missingOrders.Any())
            {
                _logger.LogInformation("No missing orders found.");
                return Enumerable.Empty<DepotOrderMissingDto>();
            }

            return missingOrders.Select(m => new DepotOrderMissingDto
            {
                MissingId = m.MissingId,
                DepotOrderId = m.DepotOrderId,
                SalesOrderId = m.SalesOrderId,
                MissingReason = m.MissingReason,
                MissingDescription = m.MissingDescription,
                MissingDate = m.MissingDate,
                DescriptionResolution = m.DescriptionResolution,
                MissingItems = m.MissingItems.Select(mi => new DepotOrderMissingItemDto
                {
                    Id = mi.Id,
                    DepotOrderItemId = mi.DepotOrderItemId,
                    ProductName = mi.ProductName,
                    ProductBrand = mi.ProductBrand,
                    Packaging = mi.Packaging,
                    MissingQuantity = mi.MissingQuantity
                }).ToList(),
                DepotOrder = new DepotOrderDto
                {
                    DepotOrderId = m.DepotOrder.DepotOrderId,
                    SalesOrderId = m.DepotOrder.SalesOrderId,
                    CustomerName = m.DepotOrder.CustomerName,
                    CustomerEmail = m.DepotOrder.CustomerEmail,
                    OrderDate = m.DepotOrder.OrderDate, 
                    AssignedOperatorId = m.DepotOrder.AssignedOperatorId,
                    Status = m.DepotOrder.Status,
                }
            }).ToList();

        }
    }
}
