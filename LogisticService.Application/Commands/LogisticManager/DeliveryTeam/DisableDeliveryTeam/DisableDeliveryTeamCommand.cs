using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryTeam.DisableDeliveryTeam
{
    public class DisableDeliveryTeamCommand
    {
        public int TeamId { get; set; }

        public DisableDeliveryTeamCommand(int teamId)
        {
            TeamId = teamId;
        }
    }
}
