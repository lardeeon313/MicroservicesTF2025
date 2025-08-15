using DepotService.Application.DTOs.DepotOrder;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.BillingManager.GetInvoicedOrdersByCustomer
{
    /// <summary>
    /// Interface for the query handler that retrieves all invoiced orders for a specific customer.
    /// </summary>
    public interface IGetInvoicedOrdersByCustomerQueryHandler
    {
        Task<List<DepotOrderDto>> GetInvoicedOrdersByCustomerAsync(GetInvoicedOrdersByCustomerQuery query);
    }
}
