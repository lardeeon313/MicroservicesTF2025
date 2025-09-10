using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.DTOs.Order
{
    public class OrderMissingDto
    {
        public int MissingId { get; set; }
        public int DepotOrderId { get; set; }
        public string? MissingReason { get; set; }
        public string? MissingDescription { get; set; }
        public string? DescriptionResolution { get; set; }
        public DateTime MissingDate { get; set; }
        public int SalesOrderId { get; set; }
        public List<OrderMissingItemDto> MissingItems { get; set; } = new List<OrderMissingItemDto>();
        public OrderDto SalesOrder { get; set; } = null!;
    }
}
