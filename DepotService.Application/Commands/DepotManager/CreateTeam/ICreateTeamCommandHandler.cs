using DepotService.Application.DTOs.DepotManager.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotManager.CreateTeam
{

    /// <summary>
    /// Interfaz para el handler del comando CreateTeam.
    /// </summary>
    public interface ICreateTeamCommandHandler
    {
        Task<CreateTeamResponse> HandleAsync(CreateTeamCommand command);
    }
}
