using DepotService.Domain.Enums;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using DepotService.Infraestructure.Documents.Excel;
using DepotService.Infraestructure.Documents.Pdf;
using DepotService.Infraestructure.Documents.Word;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.BillingManager.ExportInvoiceOrderPdf
{
    public class ExportInvoiceDocumentCommandHandler(
        DepotDbContext context,
        IDepotOrderRepository repository,
        ILogger<ExportInvoiceDocumentCommandHandler> logger,
        InvoicePdfGenerator invoicePdfGenerator,
        InvoiceWordGenerator invoiceWordGenerator,
        InvoiceExcelGenerator invoiceExcelGenerator
        ) : IExportInvoiceDocumentCommandHandler
    {
        private readonly InvoicePdfGenerator _invoicePdfGenerator = invoicePdfGenerator;
        private readonly InvoiceWordGenerator _invoiceWordGenerator = invoiceWordGenerator;
        private readonly InvoiceExcelGenerator _invoiceExcelGenerator = invoiceExcelGenerator;
        private readonly DepotDbContext _context = context;
        private readonly IDepotOrderRepository _repository = repository;
        private readonly ILogger<ExportInvoiceDocumentCommandHandler> _logger = logger;

        /// <summary>
        /// Handler para exportar una orden de factura a PDF.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <exception cref="InvalidOperationException"></exception>
        public async Task<byte[]> ExportInvoiceHandleAsync(ExportInvoiceDocumentCommand command)
        {
            var order = await _repository.GetByIdAsync(command.InvoiceOrderId);

            if (order == null)
            {
                _logger.LogError($"Invoice order with ID {command.InvoiceOrderId} not found.");
                throw new KeyNotFoundException($"Invoice order with ID {command.InvoiceOrderId} not found.");
            }

            _logger.LogInformation($"Generating invoice document for order ID {command.InvoiceOrderId}.");

            return command.Type switch
            {
                DocumentType.Pdf => _invoicePdfGenerator.Generate(order),
                DocumentType.Word => _invoiceWordGenerator.Generate(order),
                DocumentType.Excel => _invoiceExcelGenerator.Generate(order),
                _ => throw new InvalidOperationException($"Unsupported document type: {command.Type}"),
            };
        }
    }
}
