using DepotService.Application.DTOs.DepotOrder;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.BillingManager.GetAllInvoicedOrders
{
    /// <summary>
    /// Interfaz para el manejador de consultas que obtiene todos los pedidos facturados en el sistema de gestión de depósitos.
    /// </summary>
    public interface IGetAllInvoicedOrdersQueryHandler
    {
        Task<List<DepotOrderDto>> GetAllInvoicedOrdersAsync();
    }
}
