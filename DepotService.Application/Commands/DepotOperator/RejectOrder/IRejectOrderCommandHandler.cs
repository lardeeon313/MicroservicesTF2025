using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotOperator.RejectOrder
{
    /// <summary>
    /// Interfaz para el manejador del comando de rechazo de pedido del Depósito
    /// </summary>
    public interface IRejectOrderCommandHandler
    {
        Task<bool> RejectOrderHandleAsync(RejectOrderCommand command);
    }
}
