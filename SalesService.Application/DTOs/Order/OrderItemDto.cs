using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.DTOs.Order
{
    public class OrderItemDto
    {
        public int Id { get; internal set; }
        public required string ProductName { get; set; } = default!;
        public required string ProductBrand { get; set; } = default!;
        public int Quantity { get; set; }
    }
}
