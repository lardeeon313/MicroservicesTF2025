using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.ConfirmOrderAssign
{
    public class ConfirmAssignedOrderCommand
    {
        public int LogisticOrderId { get; set; }
        public Guid OperatorUserId { get; set; }

        public ConfirmAssignedOrderCommand(int logisticOrderId, Guid operatorUserId)
        {
            LogisticOrderId = logisticOrderId;
            OperatorUserId = operatorUserId;
        }
    }
}
