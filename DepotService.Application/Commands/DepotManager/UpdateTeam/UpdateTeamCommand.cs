using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotManager.UpdateTeam
{
    /// <summary>
    /// Comando para actualizar un equipo existente.
    /// </summary>
    public class UpdateTeamCommand
    {
        public int TeamId { get; set; }
        public string TeamName { get; set; } = string.Empty;
        public string? TeamDescription { get; set; }

        public UpdateTeamCommand(int teamId, string teamName, string? teamDescription)
        {
            TeamId = teamId;
            TeamName = teamName;
            TeamDescription = teamDescription;
        }
    }

}
