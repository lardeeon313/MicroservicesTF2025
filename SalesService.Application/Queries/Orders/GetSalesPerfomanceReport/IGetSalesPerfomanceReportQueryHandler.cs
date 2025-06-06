using SalesService.Application.DTOs.Order;
using SalesService.Application.DTOs.Order.Response;
using SalesService.Application.Queries.Orders.GetPagedOrders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Orders.GetSalesPerfomanceReport
{
    public interface IGetSalesPerfomanceReportQueryHandler
    {
        Task<IEnumerable<SalesPerfomanceDto>> Handle();

    }
}
