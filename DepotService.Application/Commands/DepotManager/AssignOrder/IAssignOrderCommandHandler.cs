using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotManager.AssignOrder
{
    public interface IAssignOrderCommandHandler
    {
        Task HandleAsync(AssignOrderCommand command);
    }
}
