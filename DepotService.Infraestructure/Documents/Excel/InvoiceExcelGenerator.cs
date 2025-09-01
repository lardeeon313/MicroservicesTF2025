using ClosedXML.Excel;
using DepotService.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Infraestructure.Documents.Excel
{
    public class InvoiceExcelGenerator : IInvoiceDocumentGenerator
    {
        public byte[] Generate(DepotOrderEntity order)
        {
            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Invoice");

            // Header
            worksheet.Cell(1, 1).Value = "Factura";
            worksheet.Cell(2, 1).Value = $"Invoice ID: {order.DepotOrderId}";
            worksheet.Cell(3, 1).Value = $"Customer: {order.CustomerName}";
            worksheet.Cell(4, 1).Value = $"Date: {DateTime.UtcNow:dd/MM/yyyy}";

            // Column Titles
            worksheet.Cell(6, 1).Value = "Item ID";
            worksheet.Cell(6, 2).Value = "Product Name";
            worksheet.Cell(6, 3).Value = "Brand";
            worksheet.Cell(6, 4).Value = "Quantity";
            worksheet.Cell(6, 5).Value = "Unit Price";
            worksheet.Cell(6, 6).Value = "Total";

            var row = 7;

            foreach (var item in order.Items)
            {
                worksheet.Cell(row, 1).Value = item.Id;
                worksheet.Cell(row, 2).Value = item.ProductName;
                worksheet.Cell(row, 3).Value = item.ProductBrand;
                worksheet.Cell(row, 4).Value = item.Quantity;
                worksheet.Cell(row, 5).Value = item.UnitPrice ?? 0;
                worksheet.Cell(row, 6).Value = (item.Quantity * (item.UnitPrice ?? 0));

                row++;
            }

            // Total Amount
            worksheet.Cell(row + 1, 5).Value = "Total Amount:";
            worksheet.Cell(row + 1, 6).Value = order.TotalAmount;

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }
    }
}