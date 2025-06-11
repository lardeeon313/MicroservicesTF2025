using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotOperator.ConfirmAssignedOrder
{
    /// <summary>
    /// commando para confirmar un pedido asignado a un operador en el Depósito.
    /// </summary>
    public class ConfirmAssignedOrderCommand
    {
        public int DepotOrderId { get; set; }
        public Guid OperatorUserId { get; set; }

        public ConfirmAssignedOrderCommand(int depotOrderId, Guid operatorUserId)
        {
            DepotOrderId = depotOrderId;
            OperatorUserId = operatorUserId;
        }
    }
}
