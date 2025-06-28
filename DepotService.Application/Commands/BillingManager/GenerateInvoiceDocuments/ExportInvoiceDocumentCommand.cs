using DepotService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace DepotService.Application.Commands.BillingManager.ExportInvoiceOrderPdf
{
    /// <summary>
    /// Command para exportar una orden de factura a PDF.
    /// </summary>
    public class ExportInvoiceDocumentCommand
    {
        public int InvoiceOrderId { get; set; }
        public DocumentType Type { get; set; }


        public ExportInvoiceDocumentCommand(int invoiceOrderId, DocumentType type)
        {
            InvoiceOrderId = invoiceOrderId;
            Type = type;
        }
    }
}
