using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Reports.CustomerReport
{
    public class GetCustomerReportQuery
    {
        public string? Name { get; init; }
        public string? Email { get; init; }
        public int? MinOrders { get; init; }

        public int Page { get; init; } = 1;
        public int PageSize { get; init; } = 10;

        public GetCustomerReportQuery(string? name, string? email, int? minOrders, int page, int pageSize)
        {
            Name = name;
            Email = email;
            MinOrders = minOrders;
            Page = page;
            PageSize = pageSize;
        }
    }
}
