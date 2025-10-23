using LogisticService.Domain.Entities;
using LogisticService.Domain.Enums;
using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.RejectAssignedOrder
{
    public class RejectAssignedOrderCommandHandler(ILogisticOrderRepository repository, ILogger<RejectAssignedOrderCommandHandler> logger): IRejectAssignedOrderCommandHandler
    {
        private readonly ILogisticOrderRepository _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        private readonly ILogger<RejectAssignedOrderCommandHandler> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        /// <summary>
        /// handler para rechazar la recepción de un pedido asignado a un operador de logística.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<bool> RejectAssignedOrderAsync(RejectAssignedOrderCommand command)
        {            
            var order = await _repository.GetByIdAsync(command.LogisticOrderId);
            if (order == null)
            {
                _logger.LogWarning("Order with ID {OrderId} not found.", command.LogisticOrderId);
                return false;
            }
            
            if (order.AssignedOperatorId != command.OperatorUserId)
            {
                _logger.LogWarning("Operator {OperatorId} attempted to reject an order not assigned to them ({OrderId}).",
                    command.OperatorUserId, command.LogisticOrderId);
                return false;
            }
           
            if (order.Status != OrderStatus.AssignedDelivery)
            {
                _logger.LogWarning("Order {OrderId} is not in AssignedDelivery state. Current state: {Status}.",
                    command.LogisticOrderId, order.Status);
                return false;
            }
            
            var oldStatus = order.Status;
            order.Status = OrderStatus.AssignmentCancelled;
            
            var rejection = new DeliveryRejectionReason
            {
                LogisticOrderId = order.Id,
                DeliveryOperatorId = command.OperatorUserId,
                Reason = command.Reason
            };
            await _repository.AddDeliveryRejectionAsync(rejection);
            
            var history = new OrderStatusHistory
            {
                OrderId = order.DepotOrderId,
                LogisticOrder = order,
                OldStatus = oldStatus,
                NewStatus = order.Status,
                ChangedAt = DateTime.UtcNow,                
            };
            await _repository.AddStatusHistoryAsync(history);
           
            await _repository.UpdateAsync(order);
            _logger.LogInformation("Operator {OperatorId} rejected order {OrderId}. Reason: {Reason}",
                command.OperatorUserId, command.LogisticOrderId, command.Reason);

            return true;

        }
    }
}
