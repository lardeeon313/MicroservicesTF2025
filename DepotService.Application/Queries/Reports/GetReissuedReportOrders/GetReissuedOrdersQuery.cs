using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.Reports.GetReissuedReportOrders
{
    public class GetReissuedOrdersQuery
    {
        public DateTime? From { get; }
        public DateTime? To { get; }
        public int Page { get; }
        public int PageSize { get; }

        public GetReissuedOrdersQuery(DateTime? from, DateTime? to, int page, int pageSize)
        {
            From = from;
            To = to;
            Page = page;
            PageSize = pageSize;
        }
    }
}
