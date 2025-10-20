using LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.ConfirmOrderAssign;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.ConfirmAssignedOrder
{
    public interface IConfirmAssignedOrderCommandHandler
    {
        Task<bool> ConfirmAssignedOrderAsync(ConfirmAssignedOrderCommand command);
    }
}
