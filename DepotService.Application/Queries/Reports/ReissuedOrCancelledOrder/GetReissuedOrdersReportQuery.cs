using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.Reports.ReissuedOrCancelledOrder
{
    public class GetReissuedOrdersReportQuery
    {
        public int OrderId { get; set; }
        public DateTime? ReissuedAt { get; set; }
        public string? MissingReason { get; set; }
        public string? CurrentStatus { get; set; }
    }
}
