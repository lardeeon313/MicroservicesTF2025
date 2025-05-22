using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.DTOs.Order.Request
{
    public class RegisterOrderItemRequest
    {
        [Required, MaxLength(100)]
        public required string ProductName { get; set; }

        [Required, MaxLength(100)]
        public required string ProductBrand { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
        public int Quantity { get; set; }

    }
}
