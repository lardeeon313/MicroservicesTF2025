using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Domain.Entities
{
    public class DepotOrderMissing
    {
        public int MissingId { get; set; }
        public int SalesOrderId { get; set; }
        public string? MissingReason { get; set; }
        public string? MissingDescription { get; set; }
        public string? DescriptionResolution { get; set; }
        public List<DepotOrderMissingItem> MissingItems { get; set; } = [];
        public DateTime MissingDate { get; set; } = DateTime.UtcNow;
        public int DepotOrderId { get; set; }
        public DepotOrderEntity DepotOrder { get; set; } = null!;
    }
}
