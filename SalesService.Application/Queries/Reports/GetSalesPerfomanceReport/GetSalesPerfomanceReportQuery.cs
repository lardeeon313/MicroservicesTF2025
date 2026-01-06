using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SalesService.Domain.Enums;

namespace SalesService.Application.Queries.Reports.GetSalesPerfomanceReport
{
    public class GetSalesPerformanceReportQuery
    {
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public SalesRangeReport Range { get; set; }

        public GetSalesPerformanceReportQuery(DateTime? dateFrom, DateTime? dateTo, SalesRangeReport range)
        {
            DateFrom = dateFrom;
            DateTo = dateTo;
            Range = range;
        }
    }
}
