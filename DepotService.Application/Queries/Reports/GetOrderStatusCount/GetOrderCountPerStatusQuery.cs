using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.Reports.GetOrderStatusCount
{
    public class GetOrderCountPerStatusQuery
    {
        public GetOrderCountPerStatusQuery(DateTime? from, DateTime? to)
        {
            From = from;
            To = to;
        }

        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
    }
}
