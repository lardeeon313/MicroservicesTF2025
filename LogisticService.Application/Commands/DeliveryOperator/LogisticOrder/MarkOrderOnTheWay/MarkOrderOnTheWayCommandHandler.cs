using LogisticService.Domain.Entities;
using LogisticService.Domain.Enums;
using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.MarkOrderOnTheWay
{
    public class MarkOrderOnTheWayCommandHandler(ILogisticOrderRepository repository, ILogger<IMarkOrderOnTheWayCommandHandler> logger) : IMarkOrderOnTheWayCommandHandler
    {
        private readonly ILogisticOrderRepository _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        private readonly ILogger<IMarkOrderOnTheWayCommandHandler> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        /// <summary>
        /// handler para marcar una orden como "En camino" por parte del operador de logística.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<bool> MarkOrderOnTheWayAsync(MarkOrderOnTheWayCommand command)
        {            
            var order = await _repository.GetByIdAsync(command.LogisticOrderId);
            if (order == null)
            {
                _logger.LogWarning("Order with ID {OrderId} not found", command.LogisticOrderId);
                return false;
            }
           
            if (order.Status != OrderStatus.PendingDelivery)
            {
                _logger.LogWarning(
                    "Cannot mark order {OrderId} as OnTheWay because it is not PendingDelivery. Current status: {Status}",
                    command.LogisticOrderId, order.Status
                );
                return false;
            }
            
            var statusHistory = new OrderStatusHistory
            {
                OrderId = order.DepotOrderId,
                LogisticOrder = order,
                OldStatus = order.Status,
                NewStatus = OrderStatus.OnTheWay,
                ChangedAt = DateTime.UtcNow,                
            };
            await _repository.AddStatusHistoryAsync(statusHistory);
            
            order.Status = OrderStatus.OnTheWay;            
            
            await _repository.UpdateAsync(order);
            _logger.LogInformation(
                "Order with ID {OrderId} marked as OnTheWay by operator {OperatorUserId}",
                command.LogisticOrderId, command.OperatorUserId
            );

            return true;
        }
    }
}
