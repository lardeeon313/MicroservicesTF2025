using SalesService.Application.DTOs.Order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Orders.GetByIdCustomer
{
    /// <summary>
    /// Interfaz para el manejador de la consulta GetOrderByIdCustomerQuery
    /// </summary>
    public interface IGetOrderByIdCustomerQueryHandler
    {
        Task<IEnumerable<OrderDto>> HandleAsync(GetOrderByIdCustomerQuery query);
    }
}
