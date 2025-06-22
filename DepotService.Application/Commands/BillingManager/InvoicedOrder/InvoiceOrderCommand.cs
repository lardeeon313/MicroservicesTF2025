using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.BillingManager.InvoicedOrder
{
    /// <summary>
    /// Commando para facturar un pedido en el sistema de gestión de facturación del depósito.
    /// </summary>
    public class InvoiceOrderCommand
    {
        public int DepotOrderId { get; set; }

        public InvoiceOrderCommand(int depotOrderId)
        {
            DepotOrderId = depotOrderId;
        }
    }
}
