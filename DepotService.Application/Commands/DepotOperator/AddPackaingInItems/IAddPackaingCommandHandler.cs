using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotOperator.AddPackaing
{
    /// <summary>
    /// Interfaz para el manejador del comando de adición de empaques en el Depósito.
    /// </summary>
    public interface IAddPackaingCommandHandler
    {
        Task<bool> AddPackaingAsync(AddPackagingCommand command);
    }
}
