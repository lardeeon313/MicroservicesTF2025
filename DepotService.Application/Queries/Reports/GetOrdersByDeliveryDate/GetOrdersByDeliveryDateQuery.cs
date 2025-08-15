using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.Reports.GetOrdersByDeliveryDate
{
    public class GetOrdersByDeliveryDateQuery(DateTime? from, DateTime? to, int page = 1, int pageSize = 10)
    {
        public DateTime? From { get; set; } = from;
        public DateTime? To { get; set; } = to;
        public int Page { get; set; } = page;
        public int PageSize { get; set; } = pageSize;
    }
}
