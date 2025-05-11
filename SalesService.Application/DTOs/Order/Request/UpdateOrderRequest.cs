using SalesService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.DTOs.Order.Request
{
    public class UpdateOrderRequest
    {
        public int OrderId { get; set; }
        public string? DeliveryDetail { get; set; }
        public List<UpdateOrderItemRequest> Items { get; set; } = new();
        public string? PaymentReceipt { get; set; }
        public PaymentType? PaymentType { get; set; }
        public OrderStatus Status { get; set; }
    }
}
