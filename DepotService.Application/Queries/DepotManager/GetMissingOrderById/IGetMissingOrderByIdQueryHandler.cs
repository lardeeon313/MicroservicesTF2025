using DepotService.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.DepotManager.GetMissingOrderById
{
    /// <summary>
    /// Interfaz para manejar la consulta de una orden faltante por su ID.
    /// </summary>
    public interface IGetMissingOrderByIdQueryHandler
    {
        Task<DepotOrderMissingDto> GetMissingOrderByIdAsync(int id);
    }
}
