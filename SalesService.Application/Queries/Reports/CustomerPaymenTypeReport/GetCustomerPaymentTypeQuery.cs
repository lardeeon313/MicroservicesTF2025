using SalesService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Reports.CustomerPaymenTypeReport
{
    public class GetCustomerPaymentTypeQuery
    {
        public string? Name { get; init; }
        public List<PaymentType>? PaymentTypes { get; init; }

        public DateTime? From { get; init; }
        public DateTime? To { get; init; }

        public int Page { get; init; } = 1;
        public int PageSize { get; init; } = 10;

        public GetCustomerPaymentTypeQuery(
            string? name,
            List<PaymentType>? paymentTypes,
            DateTime? from,
            DateTime? to,
            int page,
            int pageSize)
        {
            Name = name;
            PaymentTypes = paymentTypes;
            From = from;
            To = to;
            Page = page;
            PageSize = pageSize;
        }
    }
}
