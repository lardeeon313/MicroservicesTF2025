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

            var items = order.Items?.ToList() ?? new List<DepotOrderItemEntity>();

            using (MemoryStream ms = new MemoryStream())
            {
                using (WordprocessingDocument doc = WordprocessingDocument.Create(ms, WordprocessingDocumentType.Document))
                {
                    MainDocumentPart mainPart = doc.AddMainDocumentPart();
                    mainPart.Document = new Document();
                    Body body = mainPart.Document.AppendChild(new Body());

                    // Header principal con estilo
                    CreateStyledHeader(body);

                    // Espaciado
                    body.AppendChild(CreateSpacingParagraph());

                    // Sección de información en dos columnas
                    CreateInfoSection(body, order);

                    // Espaciado
                    body.AppendChild(CreateSpacingParagraph());

                    // Línea separadora
                    CreateSeparatorLine(body);

                    // Espaciado
                    body.AppendChild(CreateSpacingParagraph());

                    // Tabla de productos mejorada
                    Table table = CreateStyledInvoiceTable(order, items);
                    body.AppendChild(table);

                    // Espaciado
                    body.AppendChild(CreateSpacingParagraph());

                    // Sección de total destacada
                    CreateTotalSection(body, order);

                    // Footer
                    body.AppendChild(CreateSpacingParagraph());
                    CreateFooter(body);

                    mainPart.Document.Save();
                }

                return ms.ToArray();
            }
        }

        private static void CreateStyledHeader(Body body)
        {
            // Título principal con estilo profesional
            Paragraph titlePara = body.AppendChild(new Paragraph());
            Run titleRun = titlePara.AppendChild(new Run());
            titleRun.AppendChild(new Text("FACTURA"));

            titlePara.ParagraphProperties = new ParagraphProperties(
                new Justification() { Val = JustificationValues.Center },
                new SpacingBetweenLines() { After = "400" }
            );

            titleRun.RunProperties = new RunProperties(
                new FontSize() { Val = "48" },
                new Bold(),
                new Color() { Val = "B91C1C" }, // Rojo oscuro
                new RunFonts() { Ascii = "Arial", HighAnsi = "Arial" }
            );

            // Línea decorativa debajo del título
            Paragraph linePara = body.AppendChild(new Paragraph());
            linePara.ParagraphProperties = new ParagraphProperties(
                new Justification() { Val = JustificationValues.Center },
                new ParagraphBorders(
                    new BottomBorder()
                    {
                        Val = new EnumValue<BorderValues>(BorderValues.Single),
                        Size = 18,
                        Color = "B91C1C"
                    }
                ),
                new SpacingBetweenLines() { After = "200" }
            );
        }

        private static void CreateInfoSection(Body body, DepotOrderEntity order)
        {
            // Crear tabla de información (simula dos columnas)
            Table infoTable = new Table();

            // Propiedades de la tabla
            infoTable.AppendChild(new TableProperties(
                new TableWidth() { Width = "0", Type = TableWidthUnitValues.Auto },
                new TableBorders(
                    new TopBorder() { Val = new EnumValue<BorderValues>(BorderValues.None) },
                    new BottomBorder() { Val = new EnumValue<BorderValues>(BorderValues.None) },
                    new LeftBorder() { Val = new EnumValue<BorderValues>(BorderValues.None) },
                    new RightBorder() { Val = new EnumValue<BorderValues>(BorderValues.None) },
                    new InsideHorizontalBorder() { Val = new EnumValue<BorderValues>(BorderValues.None) },
                    new InsideVerticalBorder() { Val = new EnumValue<BorderValues>(BorderValues.None) }
                )
            ));

            // Fila con información de factura y cliente
            TableRow infoRow = new TableRow();

            // Columna izquierda - Información de factura
            TableCell invoiceInfoCell = new TableCell();
            invoiceInfoCell.TableCellProperties = new TableCellProperties(
                new TableCellWidth() { Width = "2400", Type = TableWidthUnitValues.Dxa },
                new Shading() { Val = ShadingPatternValues.Clear, Fill = "FEE2E2" }, // Fondo rojo claro
                new TableCellMargin(
                    new TopMargin() { Width = "100", Type = TableWidthUnitValues.Dxa },
                    new BottomMargin() { Width = "100", Type = TableWidthUnitValues.Dxa },
                    new LeftMargin() { Width = "100", Type = TableWidthUnitValues.Dxa },
                    new RightMargin() { Width = "100", Type = TableWidthUnitValues.Dxa }
                )
            );

            invoiceInfoCell.AppendChild(CreateInfoParagraph("INFORMACIÓN DE FACTURA", true, "B91C1C"));
            invoiceInfoCell.AppendChild(CreateInfoParagraph($"Factura N°: {order.DepotOrderId}", false, "000000", true));
            invoiceInfoCell.AppendChild(CreateInfoParagraph($"Fecha: {order.OrderDate:dd/MM/yyyy}", false, "000000"));

            // Columna derecha - Información del cliente
            TableCell clientInfoCell = new TableCell();
            clientInfoCell.TableCellProperties = new TableCellProperties(
                new TableCellWidth() { Width = "2400", Type = TableWidthUnitValues.Dxa },
                new Shading() { Val = ShadingPatternValues.Clear, Fill = "F3F4F6" }, // Fondo gris claro
                new TableCellMargin(
                    new TopMargin() { Width = "100", Type = TableWidthUnitValues.Dxa },
                    new BottomMargin() { Width = "100", Type = TableWidthUnitValues.Dxa },
                    new LeftMargin() { Width = "100", Type = TableWidthUnitValues.Dxa },
                    new RightMargin() { Width = "100", Type = TableWidthUnitValues.Dxa }
                )
            );

            clientInfoCell.AppendChild(CreateInfoParagraph("INFORMACIÓN DEL CLIENTE", true, "6B7280"));
            clientInfoCell.AppendChild(CreateInfoParagraph($"Cliente: {order.CustomerName ?? "N/D"}", false, "000000", true));
            clientInfoCell.AppendChild(CreateInfoParagraph($"Email: {order.CustomerEmail ?? "N/D"}", false, "000000"));
            clientInfoCell.AppendChild(CreateInfoParagraph($"Teléfono: {order.PhoneNumber ?? "N/D"}", false, "000000"));

            // --- NUEVO BLOQUE: Dirección ---
            if (order.DeliveryAddress != null)
            {
                clientInfoCell.AppendChild(CreateInfoParagraph("Dirección de entrega", true, "6B7280"));

                clientInfoCell.AppendChild(CreateInfoParagraph(
                    $"Calle: {order.DeliveryAddress.Street} {order.DeliveryAddress.Number}" +
                    $"{(!string.IsNullOrEmpty(order.DeliveryAddress.Apartment) ? $", Dpto: {order.DeliveryAddress.Apartment}" : "")}",
                    false, "000000"
                ));

                clientInfoCell.AppendChild(CreateInfoParagraph(
                    $"Ciudad: {order.DeliveryAddress.City}, Provincia: {order.DeliveryAddress.Province}",
                    false, "000000"
                ));

                clientInfoCell.AppendChild(CreateInfoParagraph(
                    $"Código Postal: {order.DeliveryAddress.PostalCode ?? "N/D"}",
                    false, "000000"
                ));
            }

            infoRow.Append(invoiceInfoCell, clientInfoCell);
            infoTable.AppendChild(infoRow);
            body.AppendChild(infoTable);
        }

        private static Paragraph CreateInfoParagraph(string text, bool isTitle, string color, bool isBold = false)
        {
            Paragraph para = new Paragraph();
            Run run = para.AppendChild(new Run());
            run.AppendChild(new Text(text));

            var runProperties = new RunProperties(
                new Color() { Val = color },
                new RunFonts() { Ascii = "Arial", HighAnsi = "Arial" }
            );

            if (isTitle)
            {
                runProperties.AppendChild(new Bold());
                runProperties.AppendChild(new FontSize() { Val = "20" });
            }
            else
            {
                runProperties.AppendChild(new FontSize() { Val = "18" });
                if (isBold)
                    runProperties.AppendChild(new Bold());
            }

            run.RunProperties = runProperties;

            para.ParagraphProperties = new ParagraphProperties(
                new SpacingBetweenLines() { After = "120" }
            );

            return para;
        }

        private static void CreateSeparatorLine(Body body)
        {
            Paragraph separatorPara = body.AppendChild(new Paragraph());
            separatorPara.ParagraphProperties = new ParagraphProperties(
                new ParagraphBorders(
                    new BottomBorder()
                    {
                        Val = new EnumValue<BorderValues>(BorderValues.Single),
                        Size = 12,
                        Color = "9CA3AF"
                    }
                )
            );
        }

        private static Table CreateStyledInvoiceTable(DepotOrderEntity order, List<DepotOrderItemEntity> items)
        {
            Table table = new Table();

            // Propiedades de la tabla
            table.AppendChild(new TableProperties(
                new TableWidth() { Width = "0", Type = TableWidthUnitValues.Auto },
                new TableBorders(
                    new TopBorder() { Val = new EnumValue<BorderValues>(BorderValues.Single), Size = 6, Color = "E5E7EB" },
                    new BottomBorder() { Val = new EnumValue<BorderValues>(BorderValues.Single), Size = 6, Color = "E5E7EB" },
                    new LeftBorder() { Val = new EnumValue<BorderValues>(BorderValues.Single), Size = 6, Color = "E5E7EB" },
                    new RightBorder() { Val = new EnumValue<BorderValues>(BorderValues.Single), Size = 6, Color = "E5E7EB" },
                    new InsideHorizontalBorder() { Val = new EnumValue<BorderValues>(BorderValues.Single), Size = 4, Color = "E5E7EB" },
                    new InsideVerticalBorder() { Val = new EnumValue<BorderValues>(BorderValues.Single), Size = 4, Color = "E5E7EB" }
                )
            ));

            // Header de la tabla con fondo verde
            TableRow headerRow = new TableRow();
            headerRow.Append(
                CreateStyledTableCell("Producto", true, "059669", "FFFFFF", JustificationValues.Left),
                CreateStyledTableCell("Marca", true, "059669", "FFFFFF", JustificationValues.Left),
                CreateStyledTableCell("Cantidad", true, "059669", "FFFFFF", JustificationValues.Center),
                CreateStyledTableCell("P. Unitario", true, "059669", "FFFFFF", JustificationValues.Right),
                CreateStyledTableCell("Subtotal", true, "059669", "FFFFFF", JustificationValues.Right)
            );
            table.AppendChild(headerRow);

            // Filas de productos con alternancia de colores
            if (!items.Any())
            {
                TableRow emptyRow = new TableRow();
                TableCell emptyCell = CreateStyledTableCell("No hay productos en esta orden", false, "FFFFFF", "DC2626", JustificationValues.Center);
                //emptyCell.TableCellProperties.AppendChild(new GridSpan() { Val = 5 });
                emptyRow.AppendChild(emptyCell);
                table.AppendChild(emptyRow);
            }
            else
            {
                for (int i = 0; i < items.Count; i++)
                {
                    var item = items[i];
                    var qty = item?.Quantity ?? 0;
                    var unitPrice = item?.UnitPrice ?? 0m;
                    var subtotal = qty * unitPrice;
                    var bgColor = i % 2 == 0 ? "FFFFFF" : "F9FAFB";

                    TableRow itemRow = new TableRow();
                    itemRow.Append(
                        CreateStyledTableCell(item?.ProductName ?? "N/D", false, bgColor, "000000", JustificationValues.Left),
                        CreateStyledTableCell(item?.ProductBrand ?? "N/D", false, bgColor, "000000", JustificationValues.Left),
                        CreateStyledTableCell(qty.ToString(), false, bgColor, "000000", JustificationValues.Center),
                        CreateStyledTableCell($"${unitPrice:N2}", false, bgColor, "000000", JustificationValues.Right),
                        CreateStyledTableCell($"${subtotal:N2}", false, bgColor, "000000", JustificationValues.Right, true)
                    );
                    table.AppendChild(itemRow);
                }
            }

            return table;
        }

        private static TableCell CreateStyledTableCell(string text, bool isHeader, string bgColor, string textColor,
            JustificationValues alignment, bool isBold = false)
        {
            TableCell cell = new TableCell();

            // Propiedades de la celda
            cell.TableCellProperties = new TableCellProperties(
                new Shading() { Val = ShadingPatternValues.Clear, Fill = bgColor },
                new TableCellVerticalAlignment { Val = TableVerticalAlignmentValues.Center },
                new TableCellMargin(
                    new TopMargin() { Width = "80", Type = TableWidthUnitValues.Dxa },
                    new BottomMargin() { Width = "80", Type = TableWidthUnitValues.Dxa },
                    new LeftMargin() { Width = "80", Type = TableWidthUnitValues.Dxa },
                    new RightMargin() { Width = "80", Type = TableWidthUnitValues.Dxa }
                )
            );

            // Párrafo con el texto
            Paragraph para = new Paragraph();
            Run run = para.AppendChild(new Run());
            run.AppendChild(new Text(text));

            // Propiedades del párrafo
            para.ParagraphProperties = new ParagraphProperties(
                new Justification() { Val = alignment }
            );

            // Propiedades del texto
            var runProperties = new RunProperties(
                new Color() { Val = textColor },
                new RunFonts() { Ascii = "Arial", HighAnsi = "Arial" },
                new FontSize() { Val = isHeader ? "20" : "18" }
            );

            if (isHeader || isBold)
                runProperties.AppendChild(new Bold());

            run.RunProperties = runProperties;
            cell.AppendChild(para);

            return cell;
        }

        private static void CreateTotalSection(Body body, DepotOrderEntity order)
        {
            // Crear párrafo alineado a la derecha para el total
            Paragraph totalPara = body.AppendChild(new Paragraph());
            totalPara.ParagraphProperties = new ParagraphProperties(
                new Justification() { Val = JustificationValues.Right },
                new ParagraphBorders(
                    new TopBorder() { Val = new EnumValue<BorderValues>(BorderValues.Single), Size = 8, Color = "B91C1C" },
                    new BottomBorder() { Val = new EnumValue<BorderValues>(BorderValues.Single), Size = 8, Color = "B91C1C" },
                    new LeftBorder() { Val = new EnumValue<BorderValues>(BorderValues.Single), Size = 8, Color = "B91C1C" },
                    new RightBorder() { Val = new EnumValue<BorderValues>(BorderValues.Single), Size = 8, Color = "B91C1C" }
                ),
                new Shading() { Val = ShadingPatternValues.Clear, Fill = "B91C1C" },
                new Indentation() { Left = "3600" },
                new SpacingBetweenLines() { Before = "200", After = "200" }
            );

            // Texto "TOTAL A PAGAR"
            Run totalLabelRun = totalPara.AppendChild(new Run());
            totalLabelRun.AppendChild(new Text("TOTAL A PAGAR: "));
            totalLabelRun.RunProperties = new RunProperties(
                new Color() { Val = "FFFFFF" },
                new Bold(),
                new FontSize() { Val = "24" },
                new RunFonts() { Ascii = "Arial", HighAnsi = "Arial" }
            );

            // Monto del total
            Run totalAmountRun = totalPara.AppendChild(new Run());
            totalAmountRun.AppendChild(new Text($"${(order.TotalAmount > 0 ? order.TotalAmount : 0):N2}"));
            totalAmountRun.RunProperties = new RunProperties(
                new Color() { Val = "FFFFFF" },
                new Bold(),
                new FontSize() { Val = "28" },
                new RunFonts() { Ascii = "Arial", HighAnsi = "Arial" }
            );
        }

        private static void CreateFooter(Body body)
        {
            Paragraph footerPara = body.AppendChild(new Paragraph());
            Run footerRun = footerPara.AppendChild(new Run());
            footerRun.AppendChild(new Text($"Documento generado automáticamente - {DateTime.Now:dd/MM/yyyy HH:mm}"));

            footerPara.ParagraphProperties = new ParagraphProperties(
                new Justification() { Val = JustificationValues.Center },
                new Shading() { Val = ShadingPatternValues.Clear, Fill = "F3F4F6" },
                new SpacingBetweenLines() { Before = "400" }
            );

            footerRun.RunProperties = new RunProperties(
                new Color() { Val = "6B7280" },
                new FontSize() { Val = "16" },
                new Italic(),
                new RunFonts() { Ascii = "Arial", HighAnsi = "Arial" }
            );
        }

        private static Paragraph CreateSpacingParagraph()
        {
            Paragraph spacingPara = new Paragraph();
            spacingPara.ParagraphProperties = new ParagraphProperties(
                new SpacingBetweenLines() { After = "200" }
            );
            return spacingPara;
        }

        // Método auxiliar para crear un párrafo con texto (mantenido para compatibilidad)
        private static Paragraph CreateParagraph(string text)
        {
            return new Paragraph(new Run(new Text(text)));
        }
    }
}