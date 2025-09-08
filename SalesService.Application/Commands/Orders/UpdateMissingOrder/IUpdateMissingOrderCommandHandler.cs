using SalesService.Application.Commands.Orders.Update;
using SalesService.Application.DTOs.Order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Orders.UpdateMissingOrder
{
    public interface IUpdateMissingOrderCommandHandler
    {
        Task<OrderDto?> HandleAsync(UpdateMissingOrderCommand command);
    }
}
