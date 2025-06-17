using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotOperator.SentOrderToBilling
{
    /// <summary>
    /// command to send an order to billing in the Depot Service.
    /// </summary>
    public class SentOrderToBillingCommand
    {
        public int DepotOrderId { get; set; }

        public SentOrderToBillingCommand(int depotOrderId)
        {
             DepotOrderId = depotOrderId;
        }
    }
}
