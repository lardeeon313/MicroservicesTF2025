using DepotService.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xceed.Document.NET;
using Xceed.Words.NET;

namespace DepotService.Infraestructure.Documents.Word
{
    public class InvoiceWordGenerator : IInvoiceDocumentGenerator
    {
        public byte[] Generate(DepotOrderEntity order)
        {
            using var stream = new MemoryStream();
            using var document = DocX.Create(stream);

            document.InsertParagraph("Factura").FontSize(20).Bold().Alignment = Alignment.center;
            document.InsertParagraph($"Invoice ID: {order.DepotOrderId}");
            document.InsertParagraph($"Customer: {order.CustomerName}");
            document.InsertParagraph($"Date: {DateTime.UtcNow:dd/MM/yyyy}");
            document.InsertParagraph("");

            var table = document.AddTable(order.Items.Count + 2, 6);
            table.Design = TableDesign.MediumList2Accent1;

            // Headers
            table.Rows[0].Cells[0].Paragraphs[0].Append("Item ID");
            table.Rows[0].Cells[1].Paragraphs[0].Append("Product Name");
            table.Rows[0].Cells[2].Paragraphs[0].Append("Brand");
            table.Rows[0].Cells[3].Paragraphs[0].Append("Quantity");
            table.Rows[0].Cells[4].Paragraphs[0].Append("Unit Price");
            table.Rows[0].Cells[5].Paragraphs[0].Append("Total");

            int row = 1;
            foreach (var item in order.Items)
            {
                table.Rows[row].Cells[0].Paragraphs[0].Append(item.Id.ToString());
                table.Rows[row].Cells[1].Paragraphs[0].Append(item.ProductName);
                table.Rows[row].Cells[2].Paragraphs[0].Append(item.ProductBrand);
                table.Rows[row].Cells[3].Paragraphs[0].Append(item.Quantity.ToString());
                table.Rows[row].Cells[4].Paragraphs[0].Append((item.UnitPrice ?? 0).ToString("C"));
                table.Rows[row].Cells[5].Paragraphs[0].Append((item.Quantity * (item.UnitPrice ?? 0)).ToString("C"));
                row++;
            }

            // Total
            table.Rows[^1].Cells[4].Paragraphs[0].Append("Total Amount:");
            table.Rows[^1].Cells[5].Paragraphs[0].Append(order.TotalAmount.ToString("C"));

            document.InsertTable(table);
            document.Save();
            return stream.ToArray();
        }
    }
}
