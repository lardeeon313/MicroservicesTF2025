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
    public class CreateTeamCommand(string teamName)
    {
        /// <summary>
        /// Nombre del equipo a crear.
        /// </summary>
        public string TeamName { get; set; } = teamName ?? throw new ArgumentNullException(nameof(teamName));
    }
}
