using SalesService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.DTOs.Order.Request
{
    public class UpdateOrderRequest
    {
        [Required]
        public int OrderId { get; set; }

        [MaxLength(200)]
        public string? DeliveryDetail { get; set; }

        public List<UpdateOrderItemRequest> Items { get; set; } = new();
        public string? PaymentReceipt { get; set; }
        public PaymentType? PaymentType { get; set; }
        public OrderStatus Status { get; set; }
    }
}
