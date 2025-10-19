using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedKernel.IntegrationEvents.LogisticEvents
{
    public class OrderDeliveredIntegrationEvent
    {
        public int LogisticOrderId { get; set; }
        public int DepotOrderId { get; set; }
        public int SalesOrderId { get; set; }
        public DateTime DeliveredAt { get; set; } = DateTime.UtcNow;
    }
}
