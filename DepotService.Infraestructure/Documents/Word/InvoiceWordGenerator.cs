using DepotService.Domain.Entities;
using System;
using System.Collections.Generic;
using System.IO;
using Xceed.Words.NET;
using Xceed.Document.NET;

namespace DepotService.Infraestructure.Documents.Word
{
    public class InvoiceWordGenerator : IInvoiceDocumentGenerator
    {
        public byte[] Generate(DepotOrderEntity order)
        {
            if (order is null)
                throw new ArgumentNullException(nameof(order));

            var items = order.Items ?? new List<DepotOrderItemEntity>();

            using var ms = new MemoryStream();
            using (var doc = DocX.Create(ms)) // no toca disco
            {
                // Título
                doc.InsertParagraph("Factura")
                   .FontSize(20)
                   .Bold()
                   .Alignment = Alignment.center;

                // Datos básicos
                doc.InsertParagraph($"Invoice ID: {order.DepotOrderId}");
                doc.InsertParagraph($"Customer: {order.CustomerName ?? "-"}");
                doc.InsertParagraph($"Date: {DateTime.Now:dd/MM/yyyy}");
                doc.InsertParagraph("");

                // Siempre al menos 1 fila de ítems para no romper índices
                int itemRows = Math.Max(items.Count, 1);
                var table = doc.AddTable(itemRows + 2, 6); // header + items + total
                table.Design = TableDesign.TableGrid;

                // Encabezados
                table.Rows[0].Cells[0].Paragraphs[0].Append("Item ID");
                table.Rows[0].Cells[1].Paragraphs[0].Append("Product Name");
                table.Rows[0].Cells[2].Paragraphs[0].Append("Brand");
                table.Rows[0].Cells[3].Paragraphs[0].Append("Quantity");
                table.Rows[0].Cells[4].Paragraphs[0].Append("Unit Price");
                table.Rows[0].Cells[5].Paragraphs[0].Append("Total");

                // Filas
                int r = 1;
                if (items.Count == 0)
                {
                    // Fila vacía para que Word no se ponga histérico
                    for (int c = 0; c < 6; c++)
                        table.Rows[r].Cells[c].Paragraphs[0].Append("-");
                    r++;
                }
                else
                {
                    foreach (var it in items)
                    {
                        var qty = it?.Quantity ?? 0;
                        var unit = (decimal)(it?.UnitPrice ?? 0m);
                        var total = qty * unit;

                        table.Rows[r].Cells[0].Paragraphs[0].Append(it?.Id.ToString() ?? "-");
                        table.Rows[r].Cells[1].Paragraphs[0].Append(it?.ProductName ?? "-");
                        table.Rows[r].Cells[2].Paragraphs[0].Append(it?.ProductBrand ?? "-");
                        table.Rows[r].Cells[3].Paragraphs[0].Append(qty.ToString());
                        table.Rows[r].Cells[4].Paragraphs[0].Append(unit.ToString("C"));
                        table.Rows[r].Cells[5].Paragraphs[0].Append(total.ToString("C"));
                        r++;
                    }
                }

                // Total
                table.Rows[itemRows + 1].Cells[4].Paragraphs[0].Append("Total Amount $:");
                table.Rows[itemRows + 1].Cells[5].Paragraphs[0].Append((order.TotalAmount).ToString("C"));

                doc.InsertTable(table);

                // Guardar al stream
                doc.Save();
            }

            return ms.ToArray(); // byte[] listo para mandar
        }
    }
}
