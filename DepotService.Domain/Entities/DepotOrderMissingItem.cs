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

        public int DepotOrderId { get; set; }
        public DepotOrderEntity DepotOrder { get; set; } = null!;
        public int MissingQuantity { get; set; }
    }
}
