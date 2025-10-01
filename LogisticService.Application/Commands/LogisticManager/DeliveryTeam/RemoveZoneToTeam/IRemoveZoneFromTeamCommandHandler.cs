using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryTeam.RemoveZoneToTeam
{
    /// <summary>
    /// Interfaz del handler para remover una zona de un equipo
    /// </summary>
    public interface IRemoveZoneFromTeamCommandHandler
    {
        Task<bool> RemoveZoneAsync(RemoveZoneFromTeamCommand command);
    }
}
