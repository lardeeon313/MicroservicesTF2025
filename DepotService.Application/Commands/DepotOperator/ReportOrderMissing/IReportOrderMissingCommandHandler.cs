using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotOperator.ReportOrderMissing
{
    /// <summary>
    /// Interfaz para el manejador del comando de reporte de pedido faltante en el Depósito.
    /// </summary>
    public interface IReportOrderMissingCommandHandler
    {
        Task HandleAsync(ReportOrderMissingCommand command);
    }
}
