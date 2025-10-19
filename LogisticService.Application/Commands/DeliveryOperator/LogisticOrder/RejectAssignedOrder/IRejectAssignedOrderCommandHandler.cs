using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.RejectAssignedOrder
{
    public interface IRejectAssignedOrderCommandHandler
    {
        Task<bool> RejectAssignedOrderAsync(RejectAssignedOrderCommand command);
    }
}
