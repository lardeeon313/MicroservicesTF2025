using DepotService.Application.DTOs.DepotManager;
using DepotService.Domain.Entities;
using DepotService.Domain.Enums;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.DepotManager.GetOrdersByStatus
{
    public class GetOrdersByStatusQueryHandler(IDepotOrderRepository repository, DepotDbContext context, ILogger<GetOrdersByStatusQueryHandler> logger) : IGetOrdersByStatusQueryHandler
    {
        private readonly IDepotOrderRepository _repository = repository;
        private readonly DepotDbContext _context = context;
        private readonly ILogger<GetOrdersByStatusQueryHandler> _logger = logger;

        /// <summary>
        /// Handler para devolver órdenes por su estado.
        /// </summary>
        /// <param name="status"></param>
        /// <returns></returns>
        public async Task<IEnumerable<DepotOrderDto>> GetOrderByStatusHandlerAsync(string status)
        {
            try
            {
                if (!Enum.TryParse<OrderStatus>(status, true, out var parsedStatus))
                    throw new ArgumentException($"Invalid order status: {status}");

                var orders = await _repository.GetOrderByStatusAsync(parsedStatus.ToString());

                if (!orders.Any())
                    throw new KeyNotFoundException($"No orders found with status {status}");

                var OrderDtos = orders.Select(order => new DepotOrderDto
                {
                    DepotOrderId = order.DepotOrderId,
                    SalesOrderId = order.SalesOrderId,
                    CustomerName = order.CustomerName,
                    CustomerEmail = order.CustomerEmail,
                    PhoneNumber = order.PhoneNumber,
                    DeliveryDetail = order.DeliveryDetail,
                    OrderDate = order.OrderDate,
                    Status = order.Status,
                    Items = order.Items,
                    Missings = order.Missings,
                    AssignedDepotTeam = order.AssignedDepotTeam,
                });

                _logger.LogInformation("Orders retrieved successfully for status: {Status}", status);

                return OrderDtos;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving orders by status: {Status}", status);
                throw;
            }

        }
    }
}
