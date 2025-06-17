using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotOperator.ConfirmAssignedOrder
{
    /// <summary>
    /// Interfaz para el manejador del comando de confirmación de pedido asignado a un operador en el Depósito.
    /// </summary>
    public interface IConfirmAssignedOrderCommandHandler 
    {
        Task HandleAsync(ConfirmAssignedOrderCommand command);
    }
}
