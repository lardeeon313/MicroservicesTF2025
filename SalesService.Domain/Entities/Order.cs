using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Domain.Entities
{
    public class Order
    {
        public Guid Id { get; set; }
        public Guid CustomerId { get; set; }
        public required Customer Customer { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Issued"; // Issued, Confirmed, Canceled
        public decimal TotalAmount { get; set; }
        public string? DeliveryDetail { get; set; }
        public string? PaymentReceipt { get; set; }
        public List<OrderItem> Items { get; set; } = new();
    }
}
