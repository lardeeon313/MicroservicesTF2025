using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DepotService.Application.DTOs;
using GetOrdersQuery = DepotService.Application.Queries.Operator.GetOrdersByOperatorQuery.GetOrdersByOperatorQuery;

namespace DepotService.Application.Queries.Operator.GetOrdersByOperator
{
    public interface IGetOrdersPreparedOrSentToBillingHandler
    {
        Task<IEnumerable<DepotOrderDto>> GetOrdersPreparedBillingByOperatorAsync(GetOrdersQuery query);
    }
}
