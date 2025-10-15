using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.LogisticOrder.AssignOrder
{
    /// <summary>
    /// Commando para asignar un pedido a un operador.
    /// </summary>
    public class AssignOrderCommand
    {
        public int LogisticOrderId { get; set; }
        public Guid OperatorUserId { get; set; }
        public AssignOrderCommand(int logisticOrderId, Guid operatorId)
        {
            LogisticOrderId = logisticOrderId;
            OperatorUserId = operatorId;
        }
    }
}
