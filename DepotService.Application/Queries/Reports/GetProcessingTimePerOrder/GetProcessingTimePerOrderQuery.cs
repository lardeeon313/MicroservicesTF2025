using DocumentFormat.OpenXml.Spreadsheet;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.Reports.GetAverageDepotProcessingTime
{
    public class GetProcessingTimePerOrderQuery
    {
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
        public string? Operator { get; set; }
        public string? Customer { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }

        public GetProcessingTimePerOrderQuery(DateTime? from, DateTime? to, string? @operator, string? customer, int page, int pageSize)
        {
            From = from;
            To = to;
            Operator = @operator;
            Customer = customer;
            Page = page;
            PageSize = pageSize;
        }
    }
}
