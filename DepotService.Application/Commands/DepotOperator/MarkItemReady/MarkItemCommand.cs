using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotOperator.MarkItemReady
{
    /// <summary>
    /// Commando para marcar un artículo como listo en el Depósito
    /// </summary>
    public class MarkItemCommand
    {
        public int OrderItemId { get; set; }
        public Guid OperatorUserId { get; set; }
    }
}
