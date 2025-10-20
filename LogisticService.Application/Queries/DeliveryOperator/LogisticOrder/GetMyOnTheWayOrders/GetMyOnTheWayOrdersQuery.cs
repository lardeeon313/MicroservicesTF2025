using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.DeliveryOperator.LogisticOrder.GetMyOnTheWayOrders
{
    public class GetMyOnTheWayOrdersQuery
    {
        public Guid OperatorUserId { get; set; }
        public GetMyOnTheWayOrdersQuery(Guid operatorUserId)
        {
            OperatorUserId = operatorUserId;
        }
    }
}
