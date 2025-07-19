using DocumentFormat.OpenXml.Spreadsheet;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.Reports.GetAverageDepotProcessingTime
{
    public class GetProcessingTimePerOrderQuery(DateTime? From, DateTime? To, int page = 1, int pageSize = 10)
    {
        public DateTime? From { get; set; } = From;
        public DateTime? To { get; set; } = To;
        public int Page { get; set; } = page;
        public int PageSize { get; set; } = pageSize;
    }
}
