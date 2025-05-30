using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotManager.RemoveOperatorToTeam
{
    /// <summary>
    /// Interfaz para el manejador del comando de eliminar un operador de un equipo.
    /// </summary>
    public interface IRemoveOperatorCommandHandler
    {
        Task RemoveOperatorAsync(RemoveOperatorCommand command);
    }
}
