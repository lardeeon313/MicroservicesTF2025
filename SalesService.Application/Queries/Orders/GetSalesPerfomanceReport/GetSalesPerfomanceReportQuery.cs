using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Orders.GetSalesPerfomanceReport
{
    public record GetSalesPerformanceReportQuery(
        DateTime? DateFrom,
        DateTime? DateTo,
        string? CreatedByUserId,
        string? OrderStatus
    );
}
