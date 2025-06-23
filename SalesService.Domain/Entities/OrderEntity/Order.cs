using SalesService.Domain.Entities.CustomerEntity;
using SalesService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Domain.Entities.OrderEntity
{
    public class Order
    {
        public int Id { get; set; }

        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public DateTime? DeliveryDate { get; set; }
        public DateTime? ModifiedStatusDate { get; set; }
        public decimal? TotalAmount { get; set; }
        public string? PaymentReceipt { get; set; }
        public string? DeliveryDetail { get; set; }
        public PaymentType? PaymentType { get; set; }

        // Relacion con los reportes de pedidos faltantes
        public ICollection<OrderMissing> MissingReports { get; set; } = [];

        // Relacion con el cliente
        public Guid CustomerId { get; set; }
        public Customer Customer { get; set; } = new Customer();

        // Relacion con el Usuario que creó el pedido
        public string CreatedByUserId { get; set; } = string.Empty;

        // Relacion con los productos del pedido
        public List<OrderItem> Items { get; set; } = [];
    }
}
