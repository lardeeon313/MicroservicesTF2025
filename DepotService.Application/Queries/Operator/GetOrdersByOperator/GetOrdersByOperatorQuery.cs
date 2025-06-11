using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.Operator.GetOrdersByOperatorQuery
{
    public class GetOrdersByOperatorQuery
    {
        public Guid OperatorUserId { get; set; }
        public GetOrdersByOperatorQuery(Guid operatorUserId)
        {
            OperatorUserId = operatorUserId;
        }
    }
}
