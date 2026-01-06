using SalesService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Reports.CustomerInactiveReport
{
    public class GetCustomerInactiveQuery
    {
        public string? Name { get; init; }
        public string? Email { get; init; }
        public CustomerStatus? Status { get; init; }

        public int Page { get; init; } = 1;
        public int PageSize { get; init; } = 10;

        public GetCustomerInactiveQuery(
            string? name,
            string? email,
            CustomerStatus? status,
            int page,
            int pageSize)
        {
            Name = name;
            Email = email;
            Status = status;
            Page = page;
            PageSize = pageSize;
        }
    }
}
