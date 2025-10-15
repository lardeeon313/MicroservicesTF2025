using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Customers
{
    public interface IDesactivateCustomerCommandHandler
    {
        Task<bool> DesactivateCustomerHandlerAsync(DesactivateCustomerCommand command);
    }
}
