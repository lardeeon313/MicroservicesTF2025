using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.LogisticOrder.RemoveAssignOrder
{
    public interface IRemoveAssignOrderCommandHandler
    {
        Task<bool> RemoveAssignOrder(RemoveAssignOrderCommand command);
    }
}
