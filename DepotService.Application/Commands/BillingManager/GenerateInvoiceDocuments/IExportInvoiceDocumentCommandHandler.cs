using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.BillingManager.ExportInvoiceOrderPdf
{
    /// <summary>
    /// Interfaz para manejar el comando de exportación de una orden de factura a PDF.
    /// </summary>
    public interface IExportInvoiceDocumentCommandHandler
    {
        Task<byte[]> ExportInvoiceHandleAsync(ExportInvoiceDocumentCommand command);
    }
}
