using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.BillingManager.GetInvoicedOrdersByCustomer
{

    /// <summary>
    /// Query to retrieve all invoiced orders for a specific customer.
    /// </summary>
    public class GetInvoicedOrdersByCustomerQuery
    {
        public Guid CustomerId { get; set; }

        public GetInvoicedOrdersByCustomerQuery()
        {
             
        }

        public GetInvoicedOrdersByCustomerQuery(Guid customerId)
        {
            CustomerId = customerId;
        }
    }
}
