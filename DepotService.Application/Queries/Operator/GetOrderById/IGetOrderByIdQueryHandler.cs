using DepotService.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.Operator.GetOrderById
{
    /// <summary>
    /// interfaz para manejar la consulta de obtener un pedido del Depósito por su ID asociado a un operador específico.
    /// </summary>
    public interface IGetOrderByIdQueryHandler
    {
        Task<DepotOrderDto> GetOrderByIdHandler(GetOrderByIdQuery query);
    }
}
