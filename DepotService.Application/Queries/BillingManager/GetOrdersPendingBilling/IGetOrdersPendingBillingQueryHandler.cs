using DepotService.Application.DTOs;

namespace DepotService.Application.Queries.BillingManager.GetOrdersPendingBilling
{
    /// <summary>
    /// Interfaz para el manejador de consultas que obtiene las órdenes pendientes de facturación.
    /// </summary>
    public interface IGetOrdersPendingBillingQueryHandler
    {
        Task<List<DepotOrderDto>> HandleAsync();
    }
}
