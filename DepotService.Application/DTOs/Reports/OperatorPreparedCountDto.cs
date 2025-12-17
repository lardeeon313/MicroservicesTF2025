using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.DTOs.Reports
{
    public class OperatorPreparedCountDto
    {
        public Guid OperatorId { get; set; }
        public string OperatorName { get; set; } = null!;
        public int PreparedCount { get; set; }
    }
}
