using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.MarkOrderOnTheWay
{
    public class MarkOrderOnTheWayCommand
    {
        public int LogisticOrderId { get; set; }
        public Guid OperatorUserId { get; set; }

        public MarkOrderOnTheWayCommand(int logisticOrderId, Guid operatorUserId)
        {
            LogisticOrderId = logisticOrderId;
            OperatorUserId = operatorUserId;
        }
    }
}
