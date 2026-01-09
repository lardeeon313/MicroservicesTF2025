using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Orders.CreateOrderSatisfaction
{
    public interface ICreateOrderSatisfactionCommandHandler
    {
        Task<bool> Handle(CreateOrderSatisfactionCommand command);
    }
}
