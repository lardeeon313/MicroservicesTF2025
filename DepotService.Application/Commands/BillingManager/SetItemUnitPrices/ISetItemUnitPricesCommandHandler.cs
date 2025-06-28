using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.BillingManager.SetItemUnitPrices
{
    /// <summary>
    /// Interfaz para manejar el comando de establecer precios unitarios de los artículos en una orden de depósito.
    /// </summary>
    public interface ISetItemUnitPricesCommandHandler
    {
        public Task<bool> SetItemUnitPriceHandlerAsync (SetItemUnitPricesCommand command);
    }
}
