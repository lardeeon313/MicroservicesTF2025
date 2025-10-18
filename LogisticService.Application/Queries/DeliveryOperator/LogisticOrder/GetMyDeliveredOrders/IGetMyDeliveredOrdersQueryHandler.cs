using LogisticService.Application.DTOs.LogisticOrderDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.DeliveryOperator.LogisticOrder.GetMyDeliveredOrders
{
    public interface IGetMyDeliveredOrdersQueryHandler
    {
        Task<List<LogisticOrderDto>> GetMyDeliveredOrders(GetMyDeliveredOrdersQuery query);
    }
}
