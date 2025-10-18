using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.DeliveryOperator.LogisticOrder.GetMyPendingCashOrders
{
    public class GetMyPendingCashOrdersQuery
    {
        public Guid OperatorId { get; set; }
        public GetMyPendingCashOrdersQuery(Guid operatorId)
        {
            OperatorId = operatorId;
        }
    }
}
