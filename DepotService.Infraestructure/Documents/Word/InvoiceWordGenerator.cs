using DepotService.Domain.Entities;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace DepotService.Infraestructure.Documents.Word
{
    public class InvoiceWordGenerator : IInvoiceWordGenerator
    {
        public byte[] Generate(DepotOrderEntity order)
        {
            if (order == null)
                throw new ArgumentNullException(nameof(order));

            // Asegúrate de que items no sea null y conviértelo a una lista
            var items = order.Items?.ToList() ?? new List<DepotOrderItemEntity>();

            using (MemoryStream ms = new MemoryStream())
            {
                // Crea el documento Word
                using (WordprocessingDocument doc = WordprocessingDocument.Create(ms, WordprocessingDocumentType.Document))
                {
                    // Agrega el contenido principal del documento
                    MainDocumentPart mainPart = doc.AddMainDocumentPart();
                    mainPart.Document = new Document();
                    Body body = mainPart.Document.AppendChild(new Body());

                    // --- Título ---
                    Paragraph titlePara = body.AppendChild(new Paragraph());
                    Run titleRun = titlePara.AppendChild(new Run());
                    titleRun.AppendChild(new Text("Factura"));
                    titlePara.ParagraphProperties = new ParagraphProperties(
                        new Justification() { Val = JustificationValues.Center }
                    );
                    titleRun.RunProperties = new RunProperties(
                        new FontSize() { Val = "36" },
                        new Bold()
                    );

                    // --- Datos básicos ---
                    body.AppendChild(CreateParagraph($"Invoice ID: {order.DepotOrderId}"));
                    body.AppendChild(CreateParagraph($"Cliente: {order.CustomerName ?? "-"}"));
                    body.AppendChild(CreateParagraph($"Fecha: {DateTime.Now:dd/MM/yyyy}"));

                    // --- Tabla de items ---
                    Table table = CreateInvoiceTable(order, items);
                    body.AppendChild(table);

                    // Guarda los cambios en el documento
                    mainPart.Document.Save();
                }

                return ms.ToArray();
            }
        }

        // Método auxiliar para crear un párrafo con texto
        private static Paragraph CreateParagraph(string text)
        {
            return new Paragraph(new Run(new Text(text)));
        }

        // Método auxiliar para crear la tabla de la factura
        private static Table CreateInvoiceTable(DepotOrderEntity order, List<DepotOrderItemEntity> items)
        {
            Table table = new Table();

            // --- Encabezados de la tabla ---
            TableRow headerRow = new TableRow();
            headerRow.Append(
                CreateTableCell("Item ID", true),
                CreateTableCell("Producto", true),
                CreateTableCell("Marca", true),
                CreateTableCell("Cantidad", true),
                CreateTableCell("Precio unitario", true),
                CreateTableCell("Total", true)
            );
            table.AppendChild(headerRow);

            // --- Filas de la tabla (items) ---
            if (!items.Any())
            {
                TableRow emptyRow = new TableRow();
                for (int i = 0; i < 6; i++)
                {
                    emptyRow.AppendChild(CreateTableCell("-"));
                }
                table.AppendChild(emptyRow);
            }
            else
            {
                foreach (var item in items)
                {
                    var qty = item?.Quantity ?? 0;
                    var unitPrice = item != null ? (decimal)(item.UnitPrice ?? 0m) : 0m;
                    var total = qty * unitPrice;

                    TableRow itemRow = new TableRow();
                    itemRow.Append(
                        CreateTableCell(item?.Id.ToString() ?? "-"),
                        CreateTableCell(item?.ProductName ?? "-"),
                        CreateTableCell(item?.ProductBrand ?? "-"),
                        CreateTableCell(qty.ToString()),
                        CreateTableCell(unitPrice.ToString("C")),
                        CreateTableCell(total.ToString("C"))
                    );
                    table.AppendChild(itemRow);
                }
            }

            // --- Fila del total ---
            TableRow totalRow = new TableRow();
            for (int i = 0; i < 4; i++)
            {
                totalRow.AppendChild(CreateTableCell(""));
            }
            totalRow.Append(
                CreateTableCell("Monto Total $:", true),
                CreateTableCell(order.TotalAmount.ToString("C"), true)
            );
            table.AppendChild(totalRow);

            return table;
        }

        // Método auxiliar para crear una celda de tabla
        private static TableCell CreateTableCell(string text, bool isHeader = false)
        {
            TableCell cell = new TableCell(
                new Paragraph(
                    new Run(
                        new Text(text)
                    )
                )
            );

            if (isHeader)
            {
                cell.TableCellProperties = new TableCellProperties(
                    new TableCellVerticalAlignment { Val = TableVerticalAlignmentValues.Center },
                    new Shading { Val = ShadingPatternValues.Clear, Fill = "auto" }
                );
            }

            return cell;
        }
    }
}
