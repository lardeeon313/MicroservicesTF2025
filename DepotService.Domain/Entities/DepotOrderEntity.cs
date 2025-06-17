using DepotService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Domain.Entities
{
    public class DepotOrderEntity
    {
        public int DepotOrderId { get; set; }
        public int SalesOrderId { get; set; }
        public Guid CustomerId { get; set; }
        public string CustomerName { get; set; } = null!;
        public string CustomerEmail { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public string? DeliveryDetail { get; set; }
        public DateTime OrderDate { get; set; }
        public OrderStatus Status { get; set; }

        // Relacion con Items
        public ICollection<DepotOrderItemEntity> Items { get; set; } = [];

        // Relacion con Faltantes
        public ICollection<DepotOrderMissing> Missings { get; set; } = [];
        public Guid? AssignedOperatorId { get; private set; }
        public DepotTeamEntity? AssignedDepotTeam { get; set; }
        public int? AssignedDepotTeamId { get; private set; }
        public string? RejectionReason { get; private set; }
        public void AssignToOperator(Guid operatorId)
        {
            if (Status != OrderStatus.Received && Status != OrderStatus.ReReceived)
                throw new InvalidOperationException("Cannot assign employee to an order that is not confirmed to sales.");

            AssignedOperatorId = operatorId;
            Status = OrderStatus.Assigned;
        }

        public void ConfirmAssigment()
        {
            if(Status != OrderStatus.Assigned)
                throw new InvalidOperationException("Cannot confirm assignment of an order that is not assigned to a ID Operator.");

            Status = OrderStatus.InPreparation;
        }

        public void RejectOrder(string rejectionReason)
        {
            if (Status != OrderStatus.Assigned)
                throw new InvalidOperationException("Cannot reject an order that is not assigned.");

            RejectionReason = rejectionReason;
            AssignedOperatorId = null;
            AssignedDepotTeam = null;
            Status = OrderStatus.Received;
        }
    }
}
