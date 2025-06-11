using DepotService.Application.DTOs.DepotManager;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.Operator.GetOrdersByOperatorQuery
{
    public interface IGetOrdersByOperatorQueryHandler
    {
        Task<IEnumerable<DepotOrderDto>> GetOrdersByOperatorAsync(GetOrdersByOperatorQuery query);
    }
}
