using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedKernel.IntegrationEvents.DepotEvents
{
    public class OrderConfirmedIntegrationEvent
    {
        public int DepotOrderId { get; set; }
        public int SalesOrderId { get; set; }
        public DateTime ConfirmedAt { get; set; } = DateTime.UtcNow;
    }
}
