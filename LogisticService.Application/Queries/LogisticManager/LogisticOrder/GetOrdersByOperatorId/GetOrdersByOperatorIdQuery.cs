using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetOrdersByOperatorId
{
    public class GetOrdersByOperatorIdQuery
    {
        public Guid OperatorId { get; set; }
        public GetOrdersByOperatorIdQuery(Guid operatorId)
        {
            OperatorId = operatorId;
        }
    }
}
