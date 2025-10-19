using LogisticService.Application.DTOs.LogisticOrderDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.DeliveryOperator.LogisticOrder.GetMyPendingDeliveredOrders
{
    public interface IGetMyPendingDeliveredOrdersQueryHandler
    {
        Task<List<LogisticOrderDto>> GetMyPendingDeliveredOrdersAsync(GetMyPendingDeliveredOrdersQuery query);
    }
}
