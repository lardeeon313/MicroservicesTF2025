using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.IntegrationEvents.Order
{
    public class OrderCanceledIntegrationEvent
    {
        public int OrderId { get; set; }
        public string? Reason { get; set; }
        public DateTime CanceledDate { get; set; } = DateTime.UtcNow;
    }
}
