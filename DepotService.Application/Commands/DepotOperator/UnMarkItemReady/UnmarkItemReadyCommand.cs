using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotOperator.UnMarkItemReady
{
    /// <summary>
    /// Command to unmark an item as ready in the depot.
    /// </summary>
    public class UnmarkItemReadyCommand
    {
        public int OrderItemId { get; set; }

        public UnmarkItemReadyCommand(int orderItemId)
        {
            OrderItemId = orderItemId;
        }
    }
}
