using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotManager.OrderMissingReported
{
    /// <summary>
    /// Interfaz para manejar el comando de reporte de pedido faltante.
    /// </summary>
    public interface IOrderMissingReportedCommandHandler
    {
        Task<bool> OrderMissingHandle(OrderMissingReportedCommand command);
    }
}
