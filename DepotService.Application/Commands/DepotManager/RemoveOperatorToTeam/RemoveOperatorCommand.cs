using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotManager.RemoveOperatorToTeam
{
    /// <summary>
    /// Comando para remover un operario de un equipo
    /// </summary>
    public class RemoveOperatorCommand
    {
        public Guid OperatorUserId { get; set; }
        public int TeamId { get; set; }

        public RemoveOperatorCommand(Guid operatorByUserId, int teamId)
        {
            OperatorUserId = operatorByUserId;
            TeamId = teamId;
        }
    }
}
