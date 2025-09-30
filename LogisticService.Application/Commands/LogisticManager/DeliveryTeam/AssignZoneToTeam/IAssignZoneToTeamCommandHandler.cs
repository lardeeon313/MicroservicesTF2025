using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryTeam.AssignZoneToTeam
{
    /// <summary>
    /// Interfaz para manejar la asignacion de una zona a un equipo
    /// </summary>
    public interface IAssignZoneToTeamCommandHandler
    {
        Task<bool> AssignZoneToTeam(AssignZoneToTeamCommand command);
    }
}
