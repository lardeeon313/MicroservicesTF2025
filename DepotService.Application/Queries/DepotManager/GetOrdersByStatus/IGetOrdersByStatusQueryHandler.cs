using DepotService.Application.DTOs.DepotManager;
using DepotService.Domain.Entities;
using DepotService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.DepotManager.GetOrdersByStatus
{
    /// <summary>
    /// Interfaz para manejar la consulta de órdenes por estado.
    /// </summary>
    public interface IGetOrdersByStatusQueryHandler
    {
        Task<IEnumerable<DepotOrderDto>> GetOrderByStatusHandlerAsync(string status);
    }
}
