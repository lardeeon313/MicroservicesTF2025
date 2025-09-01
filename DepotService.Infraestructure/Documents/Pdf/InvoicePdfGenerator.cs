using DepotService.Domain.Entities;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System;
using System.Linq;

namespace DepotService.Infraestructure.Documents.Pdf
{
    public class InvoicePdfGenerator : IInvoiceDocumentGenerator
    {
        public InvoicePdfGenerator()
        {
            QuestPDF.Settings.License = LicenseType.Community;
        }

        public byte[] Generate(DepotOrderEntity order)
        {
            if (order == null)
                throw new ArgumentNullException(nameof(order), "La orden no puede ser nula.");

            return Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(50);
                    page.Header().Text($"Factura #{order.DepotOrderId}").FontSize(20).Bold().AlignCenter();

                    page.Content().Element(c =>
                    {
                        c.Column(column =>
                        {
                            column.Spacing(10);
                            column.Item().Text($"Cliente: {order.CustomerName ?? "N/D"}");
                            column.Item().Text($"Email: {order.CustomerEmail ?? "N/D"}");
                            column.Item().Text($"Fecha de Pedido: {order.OrderDate:dd/MM/yyyy}");
                            column.Item().Text($"Teléfono: {order.PhoneNumber ?? "N/D"}");

                            column.Item().LineHorizontal(1);

                            column.Item().Table(table =>
                            {
                                table.ColumnsDefinition(cols =>
                                {
                                    cols.RelativeColumn(3); // Producto
                                    cols.RelativeColumn(2); // Marca
                                    cols.RelativeColumn(1); // Cantidad
                                    cols.RelativeColumn(2); // Precio Unitario
                                    cols.RelativeColumn(2); // Subtotal
                                });

                                table.Header(header =>
                                {
                                    header.Cell().Text("Producto").Bold();
                                    header.Cell().Text("Marca").Bold();
                                    header.Cell().Text("Cantidad").Bold();
                                    header.Cell().Text("P. Unitario").Bold();
                                    header.Cell().Text("Subtotal").Bold();
                                });

                                if (order.Items != null && order.Items.Any())
                                {
                                    foreach (var item in order.Items)
                                    {
                                        table.Cell().Text(item?.ProductName ?? "N/D");
                                        table.Cell().Text(item?.ProductBrand ?? "N/D");
                                        table.Cell().Text(item?.Quantity.ToString() ?? "0");
                                        table.Cell().Text($"${(item?.UnitPrice ?? 0):N2}");
                                        table.Cell().Text($"${((item?.UnitPrice ?? 0) * (item?.Quantity ?? 0)):N2}");
                                    }
                                }
                                else
                                {
                                    table.Cell().ColumnSpan(5).Text("No hay productos en esta orden.").Bold();
                                }
                            });

                            column.Item().PaddingTop(15).AlignRight().Text($"TOTAL: ${(order.TotalAmount > 0 ? order.TotalAmount : 0):N2}").FontSize(14).Bold();
                        });
                    });

                    page.Footer().AlignCenter().Text(txt =>
                    {
                        txt.Span("Documento generado automáticamente - ");
                        txt.CurrentPageNumber();
                        txt.Span(" de ");
                        txt.TotalPages();
                        txt.Span($" - {DateTime.Now:dd/MM/yyyy HH:mm}");
                    });
                });
            }).GeneratePdf();
        }
    }
}

