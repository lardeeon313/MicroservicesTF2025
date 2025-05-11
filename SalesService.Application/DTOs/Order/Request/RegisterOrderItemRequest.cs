using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.DTOs.Order.Request
{
    public class RegisterOrderItemRequest
    {
        public required string ProductName { get; set; }
        public required string ProductBrand { get; set; }
        public int Quantity { get; set; }

    }
}
