using DepotService.Application.DTOs.DepotManager;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.DepotManager.GetAllMissingOrders
{
    /// <summary>
    /// Interfaz para manejar la consulta de todas las órdenes faltantes en el depósito.
    /// </summary>
    public interface IGetAllMissingOrdersQueryHandler
    {
        Task<IEnumerable<DepotOrderMissingDto>> GetAllMissingOrdersAsync();
    }
}
