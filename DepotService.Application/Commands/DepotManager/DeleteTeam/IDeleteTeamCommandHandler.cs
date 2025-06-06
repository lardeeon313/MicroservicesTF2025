using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotManager.DeleteTeam
{
    /// <summary>
    /// Interfaz para el manejador del comando de eliminación de equipo.
    /// </summary>
    public interface IDeleteTeamCommandHandler
    {
        Task<bool> DeleteTeamHandler(DeleteTeamCommand command);
    }
}
