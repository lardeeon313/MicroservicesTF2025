using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Customer.Interfaces
{
    public interface IRegisterCustomerCommandHandler
    {
        Task<string> Handle(RegisterCustomerCommand command);


    }
}
