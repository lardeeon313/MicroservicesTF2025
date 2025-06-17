using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotOperator.RejectOrder
{
    /// <summary>
    /// commando para rechazar un pedido del Depósito
    /// </summary>
    public class RejectOrderCommand
    {
        public int DepotOrderId { get; set; }
        public Guid OperatorUserId { get; set; }
        public string RejectionReason { get; set; } = string.Empty;
    }
}
