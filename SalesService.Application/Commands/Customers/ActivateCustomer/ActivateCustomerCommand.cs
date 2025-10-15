using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Customers.ActivateCustomer
{
    public class ActivateCustomerCommand
    {
        public Guid CustomerId { get; set; }

        public ActivateCustomerCommand(Guid customerId)
        {
             CustomerId = customerId;
        }
    }
}
