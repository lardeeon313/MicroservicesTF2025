using LogisticService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.LogisticOrder.SetPriorityOrder
{
    public class SetDeliveryPriorityOrderCommand
    {
        public int LogisticOrderId { get; set; }
        public DeliveryPriority DeliveryPriority { get; set; }

        public SetDeliveryPriorityOrderCommand(int logisticOrderId, DeliveryPriority deliveryPriority)
        {
            LogisticOrderId = logisticOrderId;
            DeliveryPriority = deliveryPriority;
        }
    }
}
