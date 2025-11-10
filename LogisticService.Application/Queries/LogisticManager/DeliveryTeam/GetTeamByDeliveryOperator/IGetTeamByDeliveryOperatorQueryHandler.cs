using LogisticService.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticManager.DeliveryTeam.GetTeamByDeliveryOperator
{
    public interface IGetTeamByDeliveryOperatorQueryHandler
    {
        Task<DeliveryTeamDto?> HandleAsync(GetTeamByDeliveryOperatorQuery query);
    }
}
