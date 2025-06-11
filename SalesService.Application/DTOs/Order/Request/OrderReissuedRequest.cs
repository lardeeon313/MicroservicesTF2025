using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.DTOs.Order.Request
{
    public class OrderReissuedRequest
    {
        [Required]
        public int SalesOrderId { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public List<UpdateOrderItemRequest> UpdateItems { get; set; } = [];

        [Required, MaxLength(500)]
        public string DescriptionResolution { get; set; } = string.Empty;
    }
}
