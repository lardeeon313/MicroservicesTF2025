using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DepotService.Application.DTOs;
using DepotService.Application.DTOs.DepotOrder;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.Extensions.Logging;
using GetOrdersQuery = DepotService.Application.Queries.Operator.GetOrdersByOperatorQuery.GetOrdersByOperatorQuery;

namespace DepotService.Application.Queries.Operator.GetOrdersByOperator
{
    public class GetOrdersPreparedOrSentToBillingHandler(IDepotOrderRepository repository,DepotDbContext context, ILogger<GetOrdersPreparedOrSentToBillingHandler> logger) : IGetOrdersPreparedOrSentToBillingHandler
    {

        private readonly IDepotOrderRepository _repository = repository;
        private readonly DepotDbContext _context = context;
        private readonly ILogger<GetOrdersPreparedOrSentToBillingHandler> _logger = logger;

        public async Task<IEnumerable<DepotOrderDto>> GetOrdersPreparedBillingByOperatorAsync(GetOrdersQuery query)
        {
            var orders = await _repository.GetPreparedOrSentToBillingAsync(query.OperatorUserId);

            if(orders == null || !orders.Any())
            {
                _logger.LogWarning("No orders found for operator {OperatorUserId}", query.OperatorUserId);
                return Enumerable.Empty<DepotOrderDto>();
            }
            _logger.LogInformation("Found {Count} orders for operator {OperatorUserId}", orders.Count(), query.OperatorUserId);

            //lo devuelve al pedido con los respectivos status : 

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
