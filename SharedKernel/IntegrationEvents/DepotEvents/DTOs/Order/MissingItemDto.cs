using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedKernel.IntegrationEvents.DepotEvents.DTOs.Order
{
    public class MissingItemDto
    {
        public int DepotOrderItemId { get; set; }
        public int DepotOrderMissingId { get; set; }
        public int SalesOrderItemId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string ProductBrand { get; set; } = string.Empty;
        public string? Packaging { get; set; }
        public int MissingQuantity { get; set; }
    }
}
