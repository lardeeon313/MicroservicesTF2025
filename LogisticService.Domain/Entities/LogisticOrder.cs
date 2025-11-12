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

        // Asignación
        public Guid? AssignedOperatorId { get; set; }
        public DeliveryTeam? AssignedDeliveryTeam { get; set; }
        public int? AssignedDeliveryTeamId { get; set; }

        // Guardar zona asignada (útil para búsquedas/filtrado)
        public int? AssignedDeliveryZoneId { get; set; }
        public DeliveryZone? AssignedDeliveryZone { get; set; }

        // ✅ AGREGAR: Relación con DeliveryTeamAssignments
        public List<DeliveryTeamAssignment> DeliveryTeamAssignments { get; set; } = new();

        // Relacion 1 a 1 con Address
        public int DeliveryAddressId { get; set; }
        public LogisticAddress DeliveryAddress { get; set; } = null!;

        public List<OrderStatusHistory> StatusHistory { get; set; } = new();
        public List<DeliveryRejectionReason> RejectionReasons { get; set; } = new();
        public List<DeliveryIncident> DeliveryIncidents { get; set; } = new();

        // Trazabilidad con DepotService y SalesService
        public int DepotOrderId { get; set; }
        public int SalesOrderId { get; set; }

        // --- MÉTODOS DE LÓGICA DE DOMINIO ---

        /// <summary>
        /// Verifica la orden.
        /// Cambia el estado de 'PendingVerification' (14) a 'Verified' (7).
        /// </summary>
        public void Verify()
        {
            if (Status != OrderStatus.PendingVerification)
            {
                throw new InvalidOperationException(
                    "Solo se puede verificar una orden en estado 'PendingVerification'.");
            }

            var oldStatus = Status;
            Status = OrderStatus.Verified;
            ModifiedStatusDate = DateTime.UtcNow;

            // Añadir al historial
            StatusHistory.Add(new OrderStatusHistory
            {
                OldStatus = oldStatus,
                NewStatus = Status,
                ChangedAt = ModifiedStatusDate.Value
            });
        }

        /// <summary>
        /// Asigna la orden a un operador y su equipo.
        /// Cambia el estado de 'Verified' (7) a 'AssignedDelivery' (15).
        /// Crea el registro en DeliveryTeamAssignments.
        /// </summary>
        public void AssignToOperator(Guid operatorId, DeliveryTeam team, int zoneId, Guid? assignedByUserId = null)
        {
            // Validación de Estado
            if (Status != OrderStatus.Verified &&
                Status != OrderStatus.AssignedDelivery &&
                Status != OrderStatus.AssignmentCancelled)
            {
                throw new InvalidOperationException(
                    "Solo se puede asignar un operador a una orden en estado 'Verified', 'AssignedDelivery' o 'AssignmentCancelled'.");
            }

            // Validación de Lógica
            if (!team.DeliveryOperators.Any(a => a.OperatorUserId == operatorId))
                throw new InvalidOperationException("El operador no pertenece al equipo proporcionado.");

            var oldStatus = Status;
            bool shouldAddToHistory = (oldStatus == OrderStatus.Verified || oldStatus == OrderStatus.AssignmentCancelled);

            // Aplicar Cambios
            AssignedOperatorId = operatorId;
            AssignedDeliveryTeam = team;
            AssignedDeliveryTeamId = team.Id;
            AssignedDeliveryZoneId = zoneId;
            Status = OrderStatus.AssignedDelivery;
            ModifiedStatusDate = DateTime.UtcNow;

            // ✅ CREAR EL REGISTRO EN DeliveryTeamAssignments
            var teamAssignment = new DeliveryTeamAssignment
            {
                LogisticOrderId = this.Id,
                DeliveryTeamId = team.Id,
                DeliveryZoneId = zoneId,
                AssignedAt = DateTime.UtcNow,
                AssignedByUserId = assignedByUserId
            };

            DeliveryTeamAssignments.Add(teamAssignment);

            // Añadir al historial solo si es una asignación inicial o una re-asignación desde cancelación
            if (shouldAddToHistory)
            {
                StatusHistory.Add(new OrderStatusHistory
                {
                    OldStatus = oldStatus,
                    NewStatus = Status,
                    ChangedAt = ModifiedStatusDate.Value
                });
            }
        }

        /// <summary>
        /// Remueve la asignación de un operador.
        /// Cambia el estado de 'AssignedDelivery' (15) de vuelta a 'Verified' (7).
        /// </summary>
        public void RemoveAssignment()
        {
            if (Status != OrderStatus.AssignedDelivery)
                throw new InvalidOperationException("Cannot remove assignment from an order that is not assigned to a delivery operator.");

            var oldStatus = Status; // 'AssignedDelivery'

            AssignedOperatorId = null;
            AssignedDeliveryTeam = null;
            AssignedDeliveryTeamId = null;
            Status = OrderStatus.Verified; // Vuelve a 'Verified'
            ModifiedStatusDate = DateTime.UtcNow;

            // Añadir al historial
            StatusHistory.Add(new OrderStatusHistory
            {
                OldStatus = oldStatus,
                NewStatus = Status,
                ChangedAt = ModifiedStatusDate.Value
            });
        }

        /// <summary>
        /// Verifica el pago en efectivo.
        /// </summary>
        public void CheckCash()
        {
            if (Status != OrderStatus.PendingCashVerification)
                throw new InvalidOperationException("Solo se puede verificar el efectivo de una orden en estado 'PendingCashVerification'.");

            if (PaymentType != Enums.PaymentType.Cash)
                throw new InvalidOperationException("Solo las órdenes con tipo de pago 'Cash' pueden ser verificadas por efectivo.");

            var oldStatus = Status; // 'PendingCashVerification'

            Status = OrderStatus.CashVerified;
            ModifiedStatusDate = DateTime.UtcNow;

            // Añadir al historial
            StatusHistory.Add(new OrderStatusHistory
            {
                OldStatus = oldStatus,
                NewStatus = Status,
                ChangedAt = ModifiedStatusDate.Value
            });
        }
    }
}