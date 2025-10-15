using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.LogisticOrder.RemoveAssignOrder
{
    public class RemoveAssignOrderCommand
    {
        public int LogisticOrderId { get; set; }
        public Guid UserId { get; set; }

        public RemoveAssignOrderCommand(int logisticOrderId, Guid userId)
        {
            LogisticOrderId = logisticOrderId;
            UserId = userId;
        }
    }
}
