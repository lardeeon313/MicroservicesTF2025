using LogisticService.Application.DTOs.LogisticOrderDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetOrdersByTeamId
{
    public interface IGetOrdersByTeamIdQueryHandler 
    {
        Task<IEnumerable<LogisticOrderDto>> HandleAsync(GetOrdersByTeamIdQuery query);
    }
}
