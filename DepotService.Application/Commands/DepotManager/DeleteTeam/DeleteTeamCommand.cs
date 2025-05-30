using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotManager.DeleteTeam
{
    /// <summary>
    ///  Comando para eliminar un equipo.
    /// </summary>
    public class DeleteTeamCommand
    {
        public int TeamId { get; set; }

        public DeleteTeamCommand(int teamId)
        {
            TeamId = teamId;
        }
    }

    
}
