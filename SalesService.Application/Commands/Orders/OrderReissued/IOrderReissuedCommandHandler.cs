using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Orders.OrderReissued
{
    public interface IOrderReissuedCommandHandler
    {
        Task<bool> HandleOrderReissuedAsync(OrderReissuedCommand command);
    }
}
