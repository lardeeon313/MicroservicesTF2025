using LogisticService.Application.DTOs.LogisticOrderDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetOrdersByCustomerId
{
    /// <summary>
    /// Interfaz para el manejador de la consulta GetOrderByIdCustomerQuery
    /// </summary>
    public interface IGetOrderByIdCustomerQueryHandler
    {
        Task<IEnumerable<LogisticOrderDto>> HandleAsync(GetOrderByIdCustomerQuery query);
    }
}
