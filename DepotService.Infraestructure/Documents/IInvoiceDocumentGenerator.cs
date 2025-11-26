using DepotService.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Infraestructure.Documents
{
    /// <summary>
    /// Genera un documento (PDF, Excel o Word) para la orden de facturación.
    /// </summary>
    /// <param name="order">La orden a facturar.</param>
    /// <returns>Byte array del documento generado.</returns>
    public interface IInvoiceDocumentGenerator
    {
        byte[] Generate(DepotOrderEntity order);

    }

    public interface IInvoiceWordGenerator
    {
        byte[] Generate(DepotOrderEntity order);
    }

    public interface IInvoiceExcelGenerator
    {
        byte[] Generate(DepotOrderEntity order);
    }

    //NO TOCAR 
    public interface IInvoicedOrdersReportPdfGenerator
    {
        byte[] Generate(List<DepotOrderEntity> orders);
    }

    public interface IInvoicedOrdersByCustomerPdfGenerator
    {
        byte[] Generate(List<DepotOrderEntity> orders);
    }


}
