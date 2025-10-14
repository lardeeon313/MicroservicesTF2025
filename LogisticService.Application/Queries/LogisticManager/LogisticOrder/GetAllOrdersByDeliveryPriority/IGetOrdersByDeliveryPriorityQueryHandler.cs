using LogisticService.Application.DTOs.LogisticOrderDtos;
using LogisticService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetAllOrdersByDeliveryPriority
{
    public interface IGetOrdersByDeliveryPriorityQueryHandler
    {
        public Task<IEnumerable<LogisticOrderDto>> GetOrdersByDeliveryPriorityAsync(GetOrdersByDeliveryPriorityQuery priority);
    }
}
