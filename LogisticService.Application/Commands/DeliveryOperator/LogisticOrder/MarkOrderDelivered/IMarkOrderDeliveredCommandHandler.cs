using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.MarkOrderDelivered
{
    public interface IMarkOrderDeliveredCommandHandler
    {
        Task<bool> MarkOrderDelivered(MarkOrderDeliveredCommand command);
    }
}
