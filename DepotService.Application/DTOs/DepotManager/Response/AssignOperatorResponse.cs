using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.DTOs.DepotManager.Response
{

    public class AssignOperatorResponse
    {
        public int TeamId { get; set; }
        public Guid OperatorUserId { get; set; }
        public DateTime AssignedAt { get; set; }
    }
}
