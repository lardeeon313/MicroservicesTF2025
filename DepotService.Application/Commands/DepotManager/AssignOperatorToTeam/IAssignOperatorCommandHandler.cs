using DepotService.Application.DTOs.DepotManager.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotManager.AssignOperator
{
    /// <summary>
    /// Interfaz para el handler del comando AssignOperator.
    /// </summary>
    public interface IAssignOperatorCommandHandler 
    {
        Task<AssignOperatorResponse> AssignOperatorAsync(AssignOperatorCommand command);
    }
}
