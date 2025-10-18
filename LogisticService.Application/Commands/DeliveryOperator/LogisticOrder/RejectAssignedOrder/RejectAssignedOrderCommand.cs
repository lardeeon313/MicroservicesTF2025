using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.RejectAssignedOrder
{
    public class RejectAssignedOrderCommand
    {
        public int LogisticOrderId { get; set; }
        public Guid OperatorUserId { get; set; }
        public string Reason { get; set; } = string.Empty;

        public RejectAssignedOrderCommand(int logisticOrderId, Guid operatorUserId, string reason)
        {
            LogisticOrderId = logisticOrderId;
            OperatorUserId = operatorUserId;
            Reason = reason;
        }
    }
}
