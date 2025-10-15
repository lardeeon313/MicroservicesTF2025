using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.LogisticOrder.SetPriorityOrder
{
    public class SetDeliveryPriorityOrderCommandHandler(ILogisticOrderRepository repository, ILogger<SetDeliveryPriorityOrderCommandHandler> logger) : ISetDeliveryPriorityOrderCommandHandler
    {
        public async Task<bool> SetPriorityHandleAsync(SetDeliveryPriorityOrderCommand command)
        {
            var order = await repository.GetByIdAsync(command.LogisticOrderId);
            if (order == null)
            {
                logger.LogWarning("Order with ID {OrderId} not found.", command.LogisticOrderId);
                return false;
            }

            order.DeliveryPriority = command.DeliveryPriority;
            await repository.UpdateAsync(order);
            
            logger.LogInformation("Order with ID {OrderId} updated to priority {Priority}.", command.LogisticOrderId, command.DeliveryPriority);
            return true;
        }
    }
}
