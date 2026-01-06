using SalesService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Reports.ModifiedCanceledOrders
{
    public class GetModifiedCanceledOrdersQuery
    {
        public string? CustomerName { get; init; }
        public DateTime? DateFrom { get; init; }
        public DateTime? DateTo { get; init; }
        public OrderStatus? Status { get; init; }

        public int Page { get; init; }
        public int PageSize { get; init; }

        public GetModifiedCanceledOrdersQuery(string? customerName, DateTime? dateFrom, DateTime? dateTo, OrderStatus? status, int page, int pageSize)
        {
            CustomerName = customerName;
            DateFrom = dateFrom;
            DateTo = dateTo;
            Status = status;
            Page = page;
            PageSize = pageSize;
        }
    }
}
