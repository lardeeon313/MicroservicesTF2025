using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedKernel.IntegrationEvents.SalesEvents.DTOs
{
    public class OrderItemsDto
    {
        public int Id { get; set; } 
        public int OrderId { get; set; }
        public required string ProductName { get; set; }
        public required string ProductBrand { get; set; } 
        public int Quantity { get; set; } 
    }
}
