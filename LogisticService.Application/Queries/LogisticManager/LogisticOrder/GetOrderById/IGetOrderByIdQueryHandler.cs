using LogisticService.Application.DTOs.LogisticOrderDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetOrderById
{
    public interface IGetOrderByIdQueryHandler
    {
        Task<LogisticOrderDto> GetOrderByIdHandleAsync(GetOrderByIdQuery query);
    }
}
