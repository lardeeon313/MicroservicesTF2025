using DepotService.Application.DTOs.DepotManager.Response;
using DepotService.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotManager.UpdateTeam
{
    /// <summary>
    /// Interfaz para el manejador del comando de actualización de equipo.
    /// </summary>
    public interface IUpdateTeamCommandHandler
    {
        Task<UpdateTeamResponse> UpdateTeamHandle(UpdateTeamCommand command); 
    }
}
