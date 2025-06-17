using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedKernel.IntegrationEvents.DepotEvents
{
    public class OrderInPreparationIntegrationEvent
    {
        public int SalesOrderId { get; set; }
        public DateTime InPreparationTime { get; set; } = DateTime.UtcNow;
    }
}
