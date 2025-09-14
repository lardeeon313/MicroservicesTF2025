using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.DTOs.Order
{
    public class OrderMissingItemDto
    {
        public int Id { get; set; }
        public int OrderItemId { get; set; }
        public string ProductName { get; set; } = null!;
        public string ProductBrand { get; set; } = null!;
        public string? Packaging { get; set; }
        public int MissingQuantity { get; set; }
    }
}
