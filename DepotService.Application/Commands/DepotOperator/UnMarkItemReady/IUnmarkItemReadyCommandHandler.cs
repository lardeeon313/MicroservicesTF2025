using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotOperator.UnMarkItemReady
{
    /// <summary>
    /// Interface for handling the command to unmark an item as ready in the depot.
    /// </summary>
    public interface IUnmarkItemReadyCommandHandler
    {
        Task<bool> UnmarkItemReady(UnmarkItemReadyCommand command);
    }
}
