using DepotService.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.DepotManager.GetAllOrders
{
    /// <summary>
    /// Interfaz para manejar la consulta de todas las órdenes en el depósito.
    /// </summary>
    public interface IGetAllOrdersQueryHandler
    {
        Task<IEnumerable<DepotOrderEntity?>> AllOrdersHandleAsync();
    }
}
