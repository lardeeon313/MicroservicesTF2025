using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryTeam.RemoveOperatorToTeam
{
    /// <summary>
    /// Interfaz para el manejador del comando de eliminar un operador de un equipo.
    /// </summary>
    public interface IRemoveOperatorToTeamCommandHandler
    {
        Task<bool> RemoveOperatorAsync(RemoveOperatorToTeamCommand command);
    }
}
