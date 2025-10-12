using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryOperatorToTeam.RemoveOperatorToTeam
{
    /// <summary>
    /// Comando para remover un operario de un equipo
    /// </summary>
    public class RemoveOperatorToTeamCommand
    {
        public Guid OperatorUserId { get; set; }
        public int TeamId { get; set; }

        public RemoveOperatorToTeamCommand(Guid operatorByUserId, int teamId)
        {
            OperatorUserId = operatorByUserId;
            TeamId = teamId;
        }
    }
}
