using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryTeam.AssignZoneToTeam
{
    /// <summary>
    /// Commando para asignar una zona a un equipo
    /// </summary>
    public class AssignZoneToTeamCommand
    {
        public int ZoneId { get; set; }
        public int TeamId { get; set; }

        public AssignZoneToTeamCommand(int zoneId, int teamId)
        {
            ZoneId = zoneId;
            TeamId = teamId;
        }
    }
}
