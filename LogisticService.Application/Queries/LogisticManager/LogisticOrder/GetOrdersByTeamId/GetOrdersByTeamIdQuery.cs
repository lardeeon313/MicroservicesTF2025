using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetOrdersByTeamId
{
    public class GetOrdersByTeamIdQuery
    {
        public int TeamId { get; set; }
        public GetOrdersByTeamIdQuery(int teamId)
        {
            TeamId = teamId;
        }
    }
}
