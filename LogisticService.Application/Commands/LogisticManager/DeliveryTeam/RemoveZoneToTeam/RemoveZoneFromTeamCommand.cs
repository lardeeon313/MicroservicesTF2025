using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryTeam.RemoveZoneToTeam
{
    /// <summary>
    /// Commando para remover una zona de un equipo
    /// </summary>
    public class RemoveZoneFromTeamCommand
    {
        public int ZoneId { get; set; }
        public int TeamId { get; set; }

        public RemoveZoneFromTeamCommand(int zoneId, int teamId)
        {
            ZoneId = zoneId;
            TeamId = teamId;
        }
    }
}
