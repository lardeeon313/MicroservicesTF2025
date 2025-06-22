using DepotService.Application.DTOs.BillingManager;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.BillingManager.SetItemUnitPrices
{
    /// <summary>
    /// Commando para establecer los precios unitarios de los artículos en un pedido de depósito.
    /// </summary>
    public class SetItemUnitPricesCommand
    {
        public int DepotOrderId { get; set; }
        public List<ItemUnitPriceDto> ItemUnitPrices { get; set; }

        public SetItemUnitPricesCommand(int depotOrderId, List<ItemUnitPriceDto> itemUnitPrices)
        {
            DepotOrderId = depotOrderId;
            ItemUnitPrices = itemUnitPrices ?? new List<ItemUnitPriceDto>();
        }
    }
}
