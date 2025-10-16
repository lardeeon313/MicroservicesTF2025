using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.LogisticOrder.SetPriorityOrder
{
    public interface ISetDeliveryPriorityOrderCommandHandler
    {
        Task<bool> SetPriorityHandleAsync(SetDeliveryPriorityOrderCommand command);
    }
}
