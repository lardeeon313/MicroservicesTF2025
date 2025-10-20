using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.DeliveryOperator.LogisticOrder.GetMyDeliveredOrders
{
    public class GetMyDeliveredOrdersQuery
    {
        public Guid OperatorId { get; set; }
        public GetMyDeliveredOrdersQuery(Guid operatorId)
        {
            OperatorId = operatorId;
        }
    }
}
