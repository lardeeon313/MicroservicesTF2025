using LogisticService.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticManager.DeliveryTeam.GetAllTeams
{
    public interface IGetAllTeamsQueryHandler
    {
        Task<IEnumerable<DeliveryTeamDto>> HandleAsync();
    }
}
