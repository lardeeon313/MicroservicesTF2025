using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Domain.ValueObjects
{
    public class DepotTeamPerformance
    {
        public int DepotTeamId { get; set; }
        public string TeamName { get; set; } = string.Empty;
        public int OrdersHandled { get; set; }
        public int MissingItemsReported { get; set; }
        public int AverageProcessingTimeMinutes { get; set; }
    }
}
