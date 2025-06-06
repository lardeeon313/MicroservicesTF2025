using DepotService.Application.DTOs.DepotManager;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.DepotManager.GetTeamById
{
    public interface IGetTeamByIdQueryHandler
    {
        Task<DepotTeamDto> GetByIdHandle(GetTeamByIdQuery query);
    }
}
