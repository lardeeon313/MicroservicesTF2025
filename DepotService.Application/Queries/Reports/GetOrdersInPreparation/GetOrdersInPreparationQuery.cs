using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.Reports.GetOrdersInPreparation
{
    public class GetOrdersInPreparationQuery
    {
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        public GetOrdersInPreparationQuery(DateTime? from, DateTime? to, int page = 1, int pageSize = 10)
        {
            From = from;
            To = to;
            Page = page;
            PageSize = pageSize;
        }
    }
}
