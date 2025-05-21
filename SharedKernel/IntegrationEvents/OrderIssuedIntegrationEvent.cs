using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedKernel.IntegrationEvents
{
    public class OrderIssuedIntegrationEvent
    {
        public int Id { get; set; }
        public Guid CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string DeliveryDetail { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public string Status { get; set; } = string.Empty;

        public List<OrderItemDto> Items { get; set; } = new();
    }


    public class OrderItemDto
    {
        public int Id { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string ProductBrand { get; set; } = string.Empty;
        public int Quantity { get; set; }
    }
}
