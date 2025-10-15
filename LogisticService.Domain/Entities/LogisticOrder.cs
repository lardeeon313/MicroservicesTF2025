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
        public DeliveryPriority? DeliveryPriority { get; set; } 
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public DateTime? DeliveryDate { get; set; }
        public DateTime? ModifiedStatusDate { get; set; }
        public decimal? TotalAmount { get; set; }
        public string? PaymentReceipt { get; set; }
        public string? DeliveryDetail { get; set; }
        public PaymentType? PaymentType { get; set; }

        // Relacion con el cliente
        public Guid CustomerId { get; set; }
        public LogisticCustomer Customer { get; set; } = null!;
        
        // Relacion con los productos del pedido
        public List<LogisticOrderItem> Items { get; set; } = [];

        // Asignación ()
        public Guid? AssignedOperatorId { get; set; } 
        public DeliveryTeam? AssignedDeliveryTeam { get; set; }
        public int? AssignedDeliveryTeamId { get; private set; } 

        // Guardar zona asignada (útil para búsquedas/filtrado)
        public int? AssignedDeliveryZoneId { get; set; }
        public DeliveryZone? AssignedDeliveryZone { get; set; }

        // Relacion 1 a 1 con Address
        public int DeliveryAddressId { get; set; }
        public LogisticAddress DeliveryAddress { get; set; } = null!;

        public List<OrderStatusHistory> StatusHistory { get; set; } = new();

        // Trazabilidad con DepotService y SalesService
        public int DepotOrderId { get; set; }
        public int SalesOrderId { get; set; }


        public void AssignToOperator(Guid operatorId, DeliveryTeam team)
        {
            if (Status != OrderStatus.PendingVerification && Status != OrderStatus.AssignedDelivery)
                throw new InvalidOperationException("cannot assign employee to an order that is not pending verification or assigned to delivery.");

            // Validar que el operador pertenezca al equipo
            if (!team.DeliveryOperators.Any(a => a.OperatorUserId == operatorId))
                throw new InvalidOperationException("El operador no pertenece al equipo proporcionado.");

            if (Status == OrderStatus.Verified)
            {
                AssignedOperatorId = operatorId;
                AssignedDeliveryTeam = team;
                AssignedDeliveryTeamId = team.Id;
                Status = OrderStatus.AssignedDelivery;
            }
        }

        public void RemoveAssignment()
        {
            if (Status != OrderStatus.AssignedDelivery)
                throw new InvalidOperationException("Cannot remove assignment from an order that is not assigned to a delivery operator.");
            AssignedOperatorId = null;
            AssignedDeliveryTeam = null;
            AssignedDeliveryTeamId = null;
            Status = OrderStatus.Verified;
        }
    }
}
