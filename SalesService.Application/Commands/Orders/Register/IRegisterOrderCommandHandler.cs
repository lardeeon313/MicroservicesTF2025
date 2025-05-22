using SalesService.Application.DTOs.Order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Orders.Register
{
    /// <summary>
    /// Interfaz  para el handler del comando de registro de pedido
    /// </summary>
    public interface IRegisterOrderCommandHandler
    {
        Task<OrderDto> HandleAsync(RegisterOrderCommand command);
    }
}
