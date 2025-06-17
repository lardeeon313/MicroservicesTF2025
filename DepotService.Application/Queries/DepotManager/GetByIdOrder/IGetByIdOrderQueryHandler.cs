using DepotService.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.DepotManager.GetByIdOrder
{
    /// <summary>
    /// Interfaz para devolver una order por su ID 
    /// </summary>
    public interface IGetByIdOrderQueryHandler
    {
        Task<DepotOrderDto> GetByIdOrderHandler(int depotOrderId);
    }
}
