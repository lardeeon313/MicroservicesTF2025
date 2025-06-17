using DepotService.Application.DTOs;
using DepotService.Application.DTOs.DepotManager;
using DepotService.Domain.Entities;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.Operator.GetOrdersByOperatorQuery
{
    public class GetOrdersByOperatorQueryHandler(IDepotOrderRepository repository, DepotDbContext context, ILogger<GetOrdersByOperatorQueryHandler> logger) : IGetOrdersByOperatorQueryHandler
    {
        private readonly IDepotOrderRepository _repository = repository;
        private readonly DepotDbContext _context = context;
        private readonly ILogger<GetOrdersByOperatorQueryHandler> _logger = logger;

        public async Task<IEnumerable<DepotOrderDto>> GetOrdersByOperatorAsync(GetOrdersByOperatorQuery query)
        {
            var orders = await _repository.GetAllByOperatorIdAsync(query.OperatorUserId);
            if (orders == null || !orders.Any())
            {
                _logger.LogWarning("No orders found for operator {OperatorUserId}", query.OperatorUserId);
                return Enumerable.Empty<DepotOrderDto>();
            }
            _logger.LogInformation("Found {Count} orders for operator {OperatorUserId}", orders.Count(), query.OperatorUserId);

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
                Items = (ICollection<DepotOrderItemEntity>)o.Items.Select(i => new DepotOrderItemDto
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
