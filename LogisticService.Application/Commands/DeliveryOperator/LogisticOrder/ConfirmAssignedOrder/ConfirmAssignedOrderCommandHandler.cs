using LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.ConfirmOrderAssign;
using LogisticService.Domain.Entities;
using LogisticService.Domain.Enums;
using LogisticService.Domain.IRepositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.ConfirmAssignedOrder
{
    public class ConfirmAssignedOrderCommandHandler(ILogisticOrderRepository repository, ILogger<ConfirmAssignedOrderCommandHandler> logger) : IConfirmAssignedOrderCommandHandler
    {
        private readonly ILogisticOrderRepository _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        private readonly ILogger<ConfirmAssignedOrderCommandHandler> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        /// <summary>
        /// Handler para confirmar la recepción de un pedido asignado a un operador de logística.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<bool> ConfirmAssignedOrderAsync(ConfirmAssignedOrderCommand command)
        {
            var order = await _repository.GetByIdAsync(command.LogisticOrderId);
            if (order == null)
            {
                _logger.LogWarning("Order with ID {OrderId} not found.", command.LogisticOrderId);
                return false;
            }
            
            if (order.AssignedOperatorId != command.OperatorUserId)
            {
                _logger.LogWarning("El operador {OperatorId} intentó confirmar una orden que no le pertenece ({OrderId}).",
                    command.OperatorUserId, command.LogisticOrderId);
                return false;
            }

            if (order.Status != OrderStatus.AssignedDelivery)
            {
                _logger.LogWarning("La orden {OrderId} no está en estado Asignada. Estado actual: {CurrentStatus}",
                    command.LogisticOrderId, order.Status);
                return false;
            }

            var oldStatus = order.Status;
            order.Status = OrderStatus.PendingDelivery;            

            var statusHistory = new OrderStatusHistory
            {
                OrderId = order.DepotOrderId,
                LogisticOrder = order,
                OldStatus = oldStatus,
                NewStatus = order.Status,
                ChangedAt = DateTime.UtcNow,                
            };
            await _repository.AddStatusHistoryAsync(statusHistory);
            
            await _repository.UpdateAsync(order);
            _logger.LogInformation("Orden {OrderId} confirmada por el operador {OperatorId}. Estado actualizado a {Status}.",
                command.LogisticOrderId, command.OperatorUserId, order.Status);

            return true;
        }
    }
}
