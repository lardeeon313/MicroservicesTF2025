using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SalesService.Domain.Entities.Customer;
using SalesService.Domain.Entities.Order;
using SalesService.Domain.Enums;

namespace SalesService.Domain.Entities.Order
{
    public class Order
    {
        public Guid Id { get; set; }
        // Relación con Customer
        public Guid CustomerId { get; set; }
        public required SalesService.Domain.Entities.Customer.Customer Customer { get; set; } // Fully qualify 'Customer' to avoid ambiguity
        // Estado como Enum
        public OrderStatus Status { get; set; } = OrderStatus.Issued;
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public DateTime? DeliveryDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string? DeliveryDetail { get; set; }
        // Ruta al comprobante o base64 string
        public string? PaymentReceipt { get; set; }
        // Relación con los productos del pedido
        public List<OrderItem> Items { get; set; } = new();
    }
}

