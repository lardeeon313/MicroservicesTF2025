using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Domain.Entities.OrderEntity
{
    public class OrderMissingItem
    {
        public int Id { get; set; }

        public int OrderMissingId { get; set; }
        public OrderMissing OrderMissing { get; set; } = null!;

        public int OrderItemId { get; set; }
        public OrderItem OrderItem { get; set; } = null!;

        public int MissingQuantity { get; set; }
    }
}
