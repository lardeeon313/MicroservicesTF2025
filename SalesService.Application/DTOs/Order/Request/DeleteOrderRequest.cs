using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.DTOs.Order.Request
{
     public class DeleteOrderRequest
    {
        [Required]
        public int OrderId { get; set; }

        [Required, MaxLength(200)]
        public string reason { get; set; } = string.Empty;
    }
}
