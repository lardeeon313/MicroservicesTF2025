using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Orders.Delete
{
    public interface IDeleteOrderCommandHandler
    {
        Task<bool> HandleAsync(DeleteOrderCommand command);
    }
}
