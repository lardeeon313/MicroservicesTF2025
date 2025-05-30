using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotManager.AssignOrder
{
    /// <summary>
    /// Commando para asignar un pedido a un operador.
    /// </summary>
    public class AssignOrderCommand
    {
        public int DepotOrderId { get; set; }
        public Guid OperatorUserId { get; set; }
        public AssignOrderCommand(int depotOrderId, Guid operatorId)
        {
            DepotOrderId = depotOrderId;
            OperatorUserId = operatorId;
        }
    }
}
