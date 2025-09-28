using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryTeam.CreateDeliveryTeam
{
    /// <summary>
    /// Command para crear un nuevo equipo de entrega.
    /// </summary>
    public class CreateDeliveryTeamCommand
    {
        public string TeamName { get; set; } = null!;
        public string? TeamDescription { get; set; }

        public CreateDeliveryTeamCommand(string teamName, string? teamDescription)
        {
            TeamName = teamName;
            TeamDescription = teamDescription;
        }
    }
}
