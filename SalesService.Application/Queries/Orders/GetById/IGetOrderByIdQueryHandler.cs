using SalesService.Application.DTOs.Order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Orders.GetById
{
    /// <summary>
    /// Interfaz para el manejador de la consulta GetOrderByIdQuery.
    /// </summary>
    public interface IGetOrderByIdQueryHandler
    {
        Task<OrderDto> Handle(GetOrderByIdQuery query);
    }
}
