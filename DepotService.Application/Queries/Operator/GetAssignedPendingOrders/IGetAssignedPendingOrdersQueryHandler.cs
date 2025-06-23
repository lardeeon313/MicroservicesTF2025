using DepotService.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.Operator.GetAssignedPendingOrders
{
    /// <summary>
    /// interfaz para manejar la consulta de pedidos pendientes asignados a un operador del depósito.
    /// </summary>
    public interface IGetAssignedPendingOrdersQueryHandler
    {
        Task<List<DepotOrderDto>> GetAssignedPendingOrders();
    }
}
