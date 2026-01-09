using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.DTOs.Order
{
    public class OrderForSatisfactionDto
    {
        public int OrderId { get; set; }

        public string CustomerName { get; set; } = string.Empty;

        public DateTime OrderDate { get; set; }
        public DateTime? DeliveryDate { get; set; }

        public string? DeliveryDetail { get; set; }

        public List<OrderItemForSatisfactionDto> Items { get; set; } = new();

        public bool AlreadyRated { get; set; }
    }
}
