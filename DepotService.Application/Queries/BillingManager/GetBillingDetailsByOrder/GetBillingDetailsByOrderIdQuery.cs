using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.BillingManager.GetBillingDetailsByOrder
{
    public class GetBillingDetailsByOrderIdQuery
    {
        public int DepotOrderId { get; set; }

        public GetBillingDetailsByOrderIdQuery(int depotOrderId)
        {
            DepotOrderId = depotOrderId;
        }
    }
}
