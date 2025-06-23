using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.BillingManager.UpdateInvoicedItemPrice
{
    /// <summary>
    /// iNTERFACE for handling the command to update the unit price of an invoiced item in a billing order.
    /// </summary>
    public interface IUpdateInvoicedItemPriceCommandHandler
    {
        Task<bool> UpdateInvoicedItemPrice(UpdateInvoicedItemPriceCommand command);
    }
}
