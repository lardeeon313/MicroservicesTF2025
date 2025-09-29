using LogisticService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Domain.Entities
{
    public class LogisticOrder
    {
        public int Id { get; set; }

        public OrderStatus Status { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public DateTime? DeliveryDate { get; set; }
        public DateTime? ModifiedStatusDate { get; set; }
        public decimal? TotalAmount { get; set; }
        public string? PaymentReceipt { get; set; }
        public string? DeliveryDetail { get; set; }
        public PaymentType? PaymentType { get; set; }

        // Relacion con el cliente
        public int CustomerId { get; set; }
        public LogisticCustomer Customer { get; set; } = null!;
        
        // Relacion con los productos del pedido
        public List<LogisticOrderItem> Items { get; set; } = [];

        // Asignación ()
        public Guid? AssignedOperatorId { get; set; } 
        public DeliveryTeam? AssignedDeliveryTeam { get; set; }
        public int? AssignedDeliveryTeamId { get; private set; } // private set if you want controlled updates

        // Guardar zona asignada (útil para búsquedas/filtrado)
        public int? AssignedDeliveryZoneId { get; set; }
        public DeliveryZone? AssignedDeliveryZone { get; set; }

        // Relacion 1 a 1 con Address
        public int DeliveryAddressId { get; set; }
        public LogisticAddress DeliveryAddress { get; set; } = null!;

        public List<OrderStatusHistory> StatusHistory { get; set; } = new();
    }
}
