using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.LogisticOrder.AssignOrder
{
    public interface IAssignOrderCommandHandler
    {
        Task<bool> HandleAsync(AssignOrderCommand command);
    }
}
