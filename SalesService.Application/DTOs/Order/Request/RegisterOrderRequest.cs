using SalesService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.DTOs.Order.Request
{
    public class RegisterOrderRequest
    {
        [Required]
        public Guid CustomerId { get; set; }

        [Required, MinLength(1)]
        public List<RegisterOrderItemRequest> Items { get; set; } = new();

        [MaxLength(220)]
        public DateTime? DeliveryDate { get; set; }

        [DataType(DataType.DateTime)]
        public string? DeliveryDetail { get; set; }
    }
}
