using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticManager.DeliveryTeam.GetTeamByDeliveryOperator
{
    public class GetTeamByDeliveryOperatorQuery
    {
        public Guid DeliveryOperatorUserId { get; set; }

        public GetTeamByDeliveryOperatorQuery(Guid deliveryOperatorUserId)
        {
            DeliveryOperatorUserId = deliveryOperatorUserId;
        }
    }
}
