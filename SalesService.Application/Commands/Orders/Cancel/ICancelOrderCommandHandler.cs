using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Orders.Cancel
{
    public interface ICancelOrderCommandHandler 
    {
        Task<bool> Handle(CancelOrderCommand command);
    }
}
