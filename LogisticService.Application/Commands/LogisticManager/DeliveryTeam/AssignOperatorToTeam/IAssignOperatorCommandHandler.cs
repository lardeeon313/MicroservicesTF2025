using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryTeam.AssignOperatorToTeam
{
    /// <summary>
    /// Interfaz para el handler del comando AssignOperator.
    /// </summary>
    public interface IAssignOperatorCommandHandler 
    {
        Task<bool> AssignOperatorAsync(AssignOperatorCommand command);
    }
}
