using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.DeliveryOperator.LogisticOrder.GetMyPendingDeliveredOrders
{
    public class GetMyPendingDeliveredOrdersQuery
    {
        public Guid OperatorUserId { get; set; }
        public GetMyPendingDeliveredOrdersQuery(Guid operatorUserId)
        {
            OperatorUserId = operatorUserId;
        }
    }
}
