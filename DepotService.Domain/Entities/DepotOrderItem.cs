using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Domain.Entities
{
    public class DepotOrderItem
    {
        public int Id { get; set; }
        public int DepotOrderId { get; set; }
        public string ProductName { get; set; } = null!;
        public string ProductBrand { get; set; } = null!;
        public int Quantity { get; set; }
    }
}
