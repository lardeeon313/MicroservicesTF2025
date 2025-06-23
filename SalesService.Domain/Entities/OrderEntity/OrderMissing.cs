using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Domain.Entities.OrderEntity
{
    public class OrderMissing
    {
        public int MissingId { get; set; }
        public string? MissingReason { get; set; }
        public string? MissingDescription { get; set; }
        public List<OrderMissingItem> MissingItems { get; set; } = [];
        public DateTime MissingDate { get; set; } = DateTime.UtcNow;

        public string? DescriptionResolution { get; set; }
        public Order Order { get; set; } = new();
        public int OrderId { get; set; }

    }
}
