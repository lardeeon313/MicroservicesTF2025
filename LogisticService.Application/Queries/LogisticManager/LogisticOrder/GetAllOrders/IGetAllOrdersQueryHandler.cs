using LogisticService.Application.DTOs.LogisticOrderDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetAllOrders
{
    public interface IGetAllOrdersQueryHandler
    {
        Task<IEnumerable<LogisticOrderDto>> GetAllHandleAsync();
    }
}
