using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetOrdersByDeliveryZoneId
{
    public class GetOrdersByDeliveryZoneIdQuery
    {
        public int DeliveryZoneId { get; set; }
        public GetOrdersByDeliveryZoneIdQuery(int deliveryZoneId)
        {
            DeliveryZoneId = deliveryZoneId;
        }
    }
}
