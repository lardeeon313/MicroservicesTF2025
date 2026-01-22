using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.DTOs.Reports
{
    public class OperatorPerformanceDto
    {
        public Guid OperatorId { get; set; }
        public string OperatorName { get; set; } = string.Empty;

        public int OrdersHandled { get; set; }
        public int MissingItemsReported { get; set; }
    }
}
