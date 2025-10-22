using LogisticService.Application.DTOs.LogisticOrderDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.DeliveryOperator.LogisticOrder.GetMyRejectOrders
{
    public interface IGetMyRejectOrdersQueryHandler
    {
        Task<List<LogisticOrderDto>> GetMyRejectOrdersAsync(Guid OperatorUserId);
    }
}
