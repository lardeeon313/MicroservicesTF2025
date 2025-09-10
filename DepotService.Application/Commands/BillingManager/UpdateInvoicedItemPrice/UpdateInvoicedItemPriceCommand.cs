using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.BillingManager.UpdateInvoicedItemPrice
{
    /// <summary>
    /// Command to update the unit price of an invoiced item in a billing order.
    /// </summary>
    public class UpdateInvoicedItemPriceCommand
    {
        public int BillingOrderId { get; set; }
        public int ItemId { get; set; }
        public decimal NewUnitPrice { get; set; }
        public bool IsEdited { get; set; }

        public UpdateInvoicedItemPriceCommand(int billingOrderId, int itemId, decimal newUnitPrice, bool isEdited)
        {
            BillingOrderId = billingOrderId;
            ItemId = itemId;
            NewUnitPrice = newUnitPrice;
            IsEdited = isEdited;
        }
    }
}
