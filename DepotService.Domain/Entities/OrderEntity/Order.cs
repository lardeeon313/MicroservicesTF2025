using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DepotService.Domain.Entities.OrderItem;
using DepotService.Domain.Enums.OrderStatus;

namespace DepotService.Domain.Entities.Order
{
    public class Order
    {
        public int Id { get; set; }
        public OrderStatus OrderStatus { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public DateTime? DeliveryDate { get; set; }
        public DateTime? ModifiedStatusDate { get; set; }
        public decimal? TotalAmount { get; set; }
        public string? PaymentReceipt { get; set; }
        public string? DeliveryDetail { get; set; }
        
        //Relacion con el cliente: 
        public Guid CustomerId { get; set; }

        public List<OrderItem> Items { get; set; } = new List<OrderItem>();
    }
}
