using DepotService.Application.DTOs.DepotManager;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.DepotManager.GetTeamByName
{
    public interface IGetTeamByNameQueryHandler
    {
        Task<DepotTeamDto> GetTeamByNameHandler(GetTeamByNameQuery query);
    }
}
