using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotOperator.SentOrderToBilling
{
    /// <summary>
    /// Interfaz para el manejador del comando SentToBillingCommandHandler
    /// </summary>
    public interface ISentToBillingCommandHandler
    {
        Task<bool> SentToBillingAsync(SentOrderToBillingCommand command);
    }
}
