using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.BillingManager.InvoicedOrder
{
    public interface IInvoiceOrderCommandHandler
    {
        public Task<bool> HandleAsync(InvoiceOrderCommand command);
    }
}
