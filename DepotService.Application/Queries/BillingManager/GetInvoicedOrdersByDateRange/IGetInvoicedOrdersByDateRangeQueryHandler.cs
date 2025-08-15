using DepotService.Application.DTOs.DepotOrder;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.BillingManager.GetInvoicedOrdersByDateRange
{
    /// <summary>
    /// Interface for the query handler that retrieves invoiced orders within a specific date range.
    /// </summary>
    public interface IGetInvoicedOrdersByDateRangeQueryHandler
    {
        Task<List<DepotOrderDto>> GetInvoicedOrdersByDateRangeAsync(GetInvoicedOrdersByDateRangeQuery query);
    }
}
