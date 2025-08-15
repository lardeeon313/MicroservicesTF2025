using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.DTOs.Reports
{
    public class DepotTeamPerformanceDto
    {
        public int DepotTeamId { get; set; }
        public string TeamName { get; set; } = string.Empty;
        public int OrdersHandled { get; set; }
        public int MissingItemsReported { get; set; }
        public int AverageProcessingTimeMinutes { get; set; }
    }
}
