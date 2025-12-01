using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Domain.ValueObjects
{
    public class CompletedOrdersReport
    {
        public int DepotOrderId { get; set; }
        public string CustomerName { get; set; } = null!;
        public Guid? OperatorId { get; set; }

        public DateTime OrderDate { get; set; }
        public DateTime PreparedAt { get; set; }
        public DateTime? DeliveryDate { get; set; }
    }
}
