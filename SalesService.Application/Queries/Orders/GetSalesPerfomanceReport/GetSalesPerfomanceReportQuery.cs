using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Orders.GetSalesPerfomanceReport
{
    public class GetSalesPerformanceReportQuery
    {
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public GetSalesPerformanceReportQuery(DateTime? dateFrom, DateTime? dateTo)
        {
            DateFrom = dateFrom;
            DateTo = dateTo;
        }
    }
}
