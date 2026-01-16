using SalesService.Domain.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Reports.CustomerSatisfactionReport
{
    public class GetCustomerSatisfactionQuery
    {
        public string? Name { get; init; }
        public string? Email { get; init; }
        public string? Level { get; init; }

        public int Page { get; init; } = 1;
        public int PageSize { get; init; } = 10;

        public GetCustomerSatisfactionQuery(
            string? name,
            string? email,
            string? level,
            int page,
            int pageSize)
        {
            Name = name;
            Email = email;
            Level = level;
            Page = page;
            PageSize = pageSize;
        }
    }
}
