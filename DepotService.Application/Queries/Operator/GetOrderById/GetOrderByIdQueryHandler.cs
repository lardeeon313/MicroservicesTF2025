using DepotService.Application.DTOs.DepotManager;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.Operator.GetOrderById
{
    public class GetOrderByIdQueryHandler(DepotDbContext context, IDepotOrderRepository repository, ILogger<GetOrderByIdQueryHandler> logger) : IGetOrderByIdQueryHandler
    {
        private readonly DepotDbContext _context = context ?? throw new ArgumentNullException(nameof(context));
        private readonly IDepotOrderRepository _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        private readonly ILogger<GetOrderByIdQueryHandler> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        /// <summary>
        /// handler para obtener una orden por su ID asociada a un operador específico.
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<DepotOrderDto> GetOrderByIdHandler(GetOrderByIdQuery query)
        {
            var order = await _repository.GetByIdAsync(query.DepotOrderId);

            if (order == null)
            {
                _logger.LogError($"Order with ID {query.DepotOrderId} not found.");
                throw new KeyNotFoundException($"Order with ID {query.DepotOrderId} not found.");
            }

            if(order.AssignedOperatorId != query.OperatorUserId)
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
                AssignedDepotTeam = order.AssignedDepotTeam,
                Missings = order.Missings,
                Items = order.Items,
            };
        }
    }
}
