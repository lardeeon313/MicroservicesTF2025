using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.MarkOrderDelivered
{
    public class MarkOrderDeliveredCommand
    {
        public int LogisticOrderId { get; set; }

        public MarkOrderDeliveredCommand(int logisticOrderId)
        {
            LogisticOrderId = logisticOrderId;
        }
    }
}
