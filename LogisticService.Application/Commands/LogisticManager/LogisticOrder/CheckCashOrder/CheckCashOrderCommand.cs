using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.LogisticOrder.CheckCashOrder
{
    public class CheckCashOrderCommand
    {
        public int LogisticOrderId { get; set; }

        public CheckCashOrderCommand( int logisticOrderId)
        {
            LogisticOrderId = logisticOrderId;
        }        
    }
}
