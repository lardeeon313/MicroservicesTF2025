using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.DTOs.Order.Request
{
    public class UpdateOrderItemRequest
    {
        [Required]
        public int Id { get; set; }

        [MaxLength(100)]
        public string ProductName { get; set; } = string.Empty;

        [MaxLength(100)]
        public string ProductBrand { get; set; } = string.Empty;

        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }
    }
}
