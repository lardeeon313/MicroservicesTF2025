using SalesService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.DTOs.Order.Request
{
    public class RegisterOrderRequest
    {
        public Guid CustomerId { get; set; }
        public List<RegisterOrderItemRequest> Items { get; set; } = new();
        public DateTime? DeliveryDate { get; set; }
        public string? DeliveryDetail { get; set; }
    }
}
