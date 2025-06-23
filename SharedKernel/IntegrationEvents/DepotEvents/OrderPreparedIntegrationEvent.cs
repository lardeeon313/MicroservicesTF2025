using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedKernel.IntegrationEvents.DepotEvents
{
    public class OrderPreparedIntegrationEvent
    {
        public int SalesOrderId { get; set; }
        public DateTime ReadyAt { get; set; }
    }
}
