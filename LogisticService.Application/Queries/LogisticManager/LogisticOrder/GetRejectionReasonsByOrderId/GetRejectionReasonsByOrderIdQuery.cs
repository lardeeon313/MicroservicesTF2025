using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetRejectionReasonsByOrderId
{
    public class GetRejectionReasonsByOrderIdQuery
    {
        public int LogisticOrderId { get; set; }
        public GetRejectionReasonsByOrderIdQuery(int logisticOrderId)
        {
            LogisticOrderId = logisticOrderId;
        }
    }
}
