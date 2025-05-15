using SalesService.Application.DTOs.Order.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Orders.GetPagedOrders
{
    public interface IGetPagedOrdersQueryHandler
    {
        Task<PagedOrderResponse> Handle(GetPagedOrdersQuery query, CancellationToken cancellationToken);
    }
}
