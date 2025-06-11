using DepotService.Application.DTOs.DepotManager;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.DepotManager.GetByIdOrder
{
    public class GetByIdOrderQueryHandler(IDepotOrderRepository repository, DepotDbContext context, ILogger<GetByIdOrderQueryHandler> logger) : IGetByIdOrderQueryHandler
    {
        private readonly IDepotOrderRepository _repository = repository;
        private readonly DepotDbContext _context = context;
        private readonly ILogger<GetByIdOrderQueryHandler> _logger = logger;
        public async Task<DepotOrderDto> GetByIdOrderHandler(int depotOrderId)
        {
            var orderExist = await _repository.GetByIdAsync(depotOrderId);

            if (orderExist == null)
            {
                _logger.LogError($"Order with ID {depotOrderId} not found.");
                throw new Exception($"Order with ID {depotOrderId} not found.");
            }

            var orderDto = new DepotOrderDto
            {
                DepotOrderId = orderExist.DepotOrderId,
                SalesOrderId = orderExist.SalesOrderId,
                CustomerName = orderExist.CustomerName,
                CustomerEmail = orderExist.CustomerEmail,
                PhoneNumber = orderExist.PhoneNumber,
                DeliveryDetail = orderExist.DeliveryDetail,
                OrderDate = orderExist.OrderDate,
                Status = orderExist.Status,
                Items = orderExist.Items,
                Missings = orderExist.Missings,
                AssignedDepotTeam = orderExist.AssignedDepotTeam
            };
            _logger.LogInformation($"Order with ID {depotOrderId} retrieved successfully.");
            return orderDto;
        }
    }
}
