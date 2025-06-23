using DepotService.Domain.Enums;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotOperator.RejectOrder
{
    public class RejectOrderCommandHandler(IDepotOrderRepository repository, DepotDbContext context, ILogger<RejectOrderCommandHandler> handler) : IRejectOrderCommandHandler
    {
        private readonly DepotDbContext _context = context ?? throw new ArgumentNullException(nameof(context));
        private readonly IDepotOrderRepository _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        private readonly ILogger<RejectOrderCommandHandler> _logger = handler ?? throw new ArgumentNullException(nameof(handler));

        /// <summary>
        /// Handler para rechazar un pedido asignado a un operador en el Depósito.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        public async Task<bool> RejectOrderHandleAsync(RejectOrderCommand command)
        {
            var order = await _repository.GetByIdAsync(command.DepotOrderId);
            if (order == null)
            {
                _logger.LogError($"Order with ID {command.DepotOrderId} not found.");
                throw new KeyNotFoundException($"Order with ID {command.DepotOrderId} not found.");
            }

            if (order.Status != OrderStatus.Assigned)
            {
                 _logger.LogError($"Order with ID {command.DepotOrderId} is not in the Assigned status.");
                throw new InvalidOperationException($"Order with ID {command.DepotOrderId} is not in the Assigned status.");
            }

            order.RejectOrder(command.RejectionReason);
            await _repository.UpdateOrderAsync(order);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Order with ID {command.DepotOrderId} has been rejected by operator {command.OperatorUserId}.");
            return true;
        }
    }
}
