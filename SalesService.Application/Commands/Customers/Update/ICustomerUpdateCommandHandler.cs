using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Customers.Update
{
    public interface ICustomerUpdateCommandHandler
    {
        Task<bool> UpdateHandle(UpdateCustomerCommand command);
    }
}
