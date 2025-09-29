using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryTeam.ActiveDeliveryTeam
{
    public class ActiveDeliveryTeamCommand
    {
        public int TeamId { get; set; }

        public ActiveDeliveryTeamCommand(int teamId)
        {
            TeamId = teamId;            
        }
    }
}
