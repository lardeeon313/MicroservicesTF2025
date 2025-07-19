using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Domain.ValueObjects
{
    public class OrderByDeliveryDate
    {
        public int OrderId { get; set; }
        public string? DeliveryDetail { get; set; } = string.Empty;
        public DateTime? DeliveryDate { get; set; }
    }
}
