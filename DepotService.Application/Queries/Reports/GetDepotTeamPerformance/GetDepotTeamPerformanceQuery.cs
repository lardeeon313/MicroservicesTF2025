using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.Reports.GetDepotTeamPerformance
{
    /// <summary>
    /// Query to get depot team performance data.
    /// </summary>
    public class GetDepotTeamPerformanceQuery(DateTime? from, DateTime? to)
    {
        public DateTime? From { get; } = from;
        public DateTime? To { get; } = to;
    }
}
