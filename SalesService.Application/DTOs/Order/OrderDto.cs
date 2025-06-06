using SalesService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.DTOs.Order
{
    public class OrderDto
    {
        public int Id { get; set; }
        public Guid CustomerId { get; set; }

        public string? CustomerFirstName { get; set; }
        public string? CustomerLastName { get; set; }
        public string? DeliveryDetail { get; set; } 
        public DateTime OrderDate { get; set; }
        public OrderStatus Status { get; set; } 
        public DateTime? DeliveryDate { get; set; }
        public PaymentType? PaymentType { get; set; }
        public List<OrderItemDto> Items { get; set; } = new();
        public DateTime? ModifiedStatusDate { get; internal set; }
        public string CreatedByUserId { get; set; } = string.Empty;
    }
}
