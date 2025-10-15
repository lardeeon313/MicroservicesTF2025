using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Customers
{
    public class DesactivateCustomerCommand
    {
        public Guid CustomerId { get; set; }

        public DesactivateCustomerCommand(Guid customerId)
        {
             CustomerId = customerId;
        }
    }
}
