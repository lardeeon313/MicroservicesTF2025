using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Customers.GetCustomerAddresses
{
    public class GetCustomerAddressesQuery
    {
        public Guid CustomerId { get; }

        public GetCustomerAddressesQuery(Guid customerId)
        {
            CustomerId = customerId;
        }
    }
}
