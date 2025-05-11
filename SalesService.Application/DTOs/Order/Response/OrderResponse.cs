using SalesService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.DTOs.Order.Response
{
    public class OrderResponse
    {
        public int Id { get; set; }
        public Guid CustomerId { get; set; }
        public DateTime OrderDate { get; set; }
        public OrderStatus Status { get; set; }
        public string? DeliveryDetail { get; set; }
        public List<OrderItemDto> Items { get; set; } = new();
    }
}
