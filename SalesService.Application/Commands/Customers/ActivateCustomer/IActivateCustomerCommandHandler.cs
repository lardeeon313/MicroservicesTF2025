using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Customers.ActivateCustomer
{
    public interface IActivateCustomerCommandHandler
    {
        Task<bool> ActivateCustomerHandlerAsync(ActivateCustomerCommand command);
    }
}
