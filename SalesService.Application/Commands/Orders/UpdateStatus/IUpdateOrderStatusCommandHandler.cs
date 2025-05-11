using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Orders.UpdateStatus
{
    public interface IUpdateOrderStatusCommandHandler
    {
        Task<bool> HandleAsync(UpdateOrderStatusCommand command);
    }
}
