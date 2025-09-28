using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryTeam.UpdateDeliveryTeam
{
    /// <summary>
    /// Comando para actualizar la información de un equipo de entrega.
    /// </summary>
    public class UpdateDeliveryTeamCommand
    {
        public int Id { get; set; }
        public string TeamName { get; set; } = string.Empty;
        public string? TeamDescription { get; set; }

        public UpdateDeliveryTeamCommand(int id, string teamName , string? teamDescription)
        {
            Id = id;
            TeamName = teamName;
            TeamDescription = teamDescription;
        }        
    }
}
