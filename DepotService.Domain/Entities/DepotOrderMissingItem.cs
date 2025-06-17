using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Domain.Entities
{
    public class DepotOrderMissingItem
    {
        public int Id { get; set; }

        public int OrderMissingId { get; set; }
        public DepotOrderMissing DepotOrderMissing{ get; set; } = null!;

        public int DepotOrderItemId { get; set; }
        public DepotOrderItemEntity DepotOrderItem { get; set; } = null!;

        public string ProductName { get; set; } = null!;
        public string ProductBrand { get; set; } = null!;
        public string? Packaging { get; set; }
        public int MissingQuantity { get; set; }
    }
}
