using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotManager.AssignOrder
{
    public class AssignOrderCommand
    {
        public int DepotOrderId { get; set; }
        public Guid OperatorId { get; set; }
        public string OperatorName { get; set; } = null!;

        public AssignOrderCommand(int depotOrderId, Guid operatorId, string operatorName)
        {
            DepotOrderId = depotOrderId;
            OperatorId = operatorId;
            OperatorName = operatorName;

        }
    }
}
