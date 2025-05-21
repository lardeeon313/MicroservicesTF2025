using DepotService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Domain.Entities
{
    public class DepotOrder
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
        public ICollection<DepotOrderItem> Items { get; set; } = new List<DepotOrderItem>();

        public Guid? AssignedOperatorId { get; private set; }
        public string? AssignedOperatorName { get; private set; }

        public void AssignToOperator(Guid operatorId, string operatorName)
        {
            if (Status != OrderStatus.ConfirmedToSales)
                throw new InvalidOperationException("Cannot assign employee to an order that is not confirmed to sales.");

            AssignedOperatorId = operatorId;
            AssignedOperatorName = operatorName;
            Status = OrderStatus.Assigned;
        }
    }
}
