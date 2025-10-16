using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Customers.GetCustomerPaymentTypes
{
    public class GetCustomerPaymentTypesQuery
    {
        public Guid CustomerId { get; set; }

        public GetCustomerPaymentTypesQuery(Guid customerId)
        {
            CustomerId = customerId;
        }
    }
}
