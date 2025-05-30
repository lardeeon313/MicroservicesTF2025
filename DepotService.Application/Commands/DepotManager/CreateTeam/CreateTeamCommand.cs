using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotManager.CreateTeam
{
    /// <summary>
    /// Comando para crear un equipo en el depósito.
    /// </summary>
    public class CreateTeamCommand
    {
        /// <summary>
        /// Nombre del equipo a crear.
        /// </summary>
        public string TeamName { get; set; } 
        public string? TeamDescription { get; set; }

        public CreateTeamCommand(string teamName, string? teamDescription)
        {
            this.TeamName = teamName;
            this.TeamDescription = teamDescription;
        }
    }
}
