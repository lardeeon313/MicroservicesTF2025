using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.LogisticOrder.VerifiedOrder
{
    public class VerifiedOrderCommand
    {
        public int LogisticOrderId { get; set; }

        public VerifiedOrderCommand(int logisticOrderId)
        {
            LogisticOrderId = logisticOrderId;
        }
    }
}
