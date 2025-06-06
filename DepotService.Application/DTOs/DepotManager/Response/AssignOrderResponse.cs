using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.DTOs.DepotManager.Response
{
    public class AssignOrderResponse
    {
        public int OrderId { get; set; }
        public Guid OperatorId { get; set; }
        public DateTime AssignedAt { get; set; }
    }
}
