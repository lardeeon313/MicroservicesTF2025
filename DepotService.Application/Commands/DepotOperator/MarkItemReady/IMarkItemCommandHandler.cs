using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotOperator.MarkItemReady
{
    /// <summary>
    /// interfaz para el manejador del comando de marcar un artículo como listo en el Depósito
    /// </summary>
    public interface IMarkItemCommandHandler
    {
        Task<bool> MarkItemHandler(MarkItemCommand command);
    }
}
