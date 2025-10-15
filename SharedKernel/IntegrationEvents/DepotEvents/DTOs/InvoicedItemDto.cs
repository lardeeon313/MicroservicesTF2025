using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedKernel.IntegrationEvents.DepotEvents.DTOs
{
    public class InvoicedItemDto
    {
        public int SalesOrderItemId { get; set; }
        public int DepotOrderItemId { get; set; }
        public string? ProductName { get; set; }
        public string? ProductBrand { get; set; }
        public string? PackagingType { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
