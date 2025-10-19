using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.DeliveryOperator.LogisticOrder.GetMyAssignedOrders
{
    public class GetMyAssignedOrdersQuery
    {
        public Guid OperatorId { get; set; }
        public GetMyAssignedOrdersQuery(Guid operatorId)
        {
            OperatorId = operatorId;
        }
    }
}
