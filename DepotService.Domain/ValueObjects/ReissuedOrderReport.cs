using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Domain.ValueObjects
{
    public class ReissuedOrderReport
    {
        public int DepotOrderId { get; set; }
        public int SalesOrderId { get; set; }
        public Guid CustomerId { get; set; }
        public string CustomerName { get; set; } = null!;
        public string CustomerEmail { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public DateTime OrderDate { get; set; }
        public DateTime? DeliveryDate { get; set; }

        public DateTime ReissuedAt { get; set; }
    } 
}
