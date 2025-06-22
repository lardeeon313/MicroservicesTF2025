using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.BillingManager.GetInvoicedOrderById
{
    /// <summary>
    /// Query to retrieve an invoiced order by its ID.
    /// </summary>
    public class GetInvoicedOrderByIdQuery
    {
        public int BillingOrderId { get; set; }
        public GetInvoicedOrderByIdQuery(int billingOrderId)
        {
            BillingOrderId = billingOrderId;
        }
    }
}
