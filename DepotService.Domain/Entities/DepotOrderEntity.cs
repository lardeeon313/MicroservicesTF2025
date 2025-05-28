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
        public string DeliveryDetail { get; set; } = null!;
        public DateTime OrderDate { get; set; }
        public OrderStatus Status { get; set; }
        public ICollection<DepotOrderItemEntity> Items { get; set; } = new List<DepotOrderItemEntity>();

        public Guid? AssignedOperatorId { get; private set; }
        public int? AssignedDepotTeamId { get; private set; }
        public void AssignToOperator(Guid operatorId)
        {
            if (Status != OrderStatus.ConfirmedToSales)
                throw new InvalidOperationException("Cannot assign employee to an order that is not confirmed to sales.");

            AssignedOperatorId = operatorId;
            Status = OrderStatus.Assigned;

            // Evento para notificar que se ha asignado un operador a la orden
        }

        // public void AssignToDepotTeam() 
        // Añadir evento al momento de asignar DepotTeam a pedido.
        //  


    }
}
