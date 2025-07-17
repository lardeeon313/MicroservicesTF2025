using DepotService.Domain.Entities;
using QuestPDF.Fluent;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Infraestructure.Documents.Pdf
{
    public class InvoicePdfGenerator : IInvoiceDocumentGenerator
    {
        public byte[] Generate(DepotOrderEntity order)
        {
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

                            column.Item().Text($"Cliente: {order.CustomerName}");
                            column.Item().Text($"Email: {order.CustomerEmail}");
                            column.Item().Text($"Fecha de Pedido: {order.OrderDate:dd/MM/yyyy}");
                            column.Item().Text($"Teléfono: {order.PhoneNumber}");
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

                                foreach (var item in order.Items)
                                {
                                    table.Cell().Text(item.ProductName);
                                    table.Cell().Text(item.ProductBrand);
                                    table.Cell().Text(item.Quantity.ToString());
                                    table.Cell().Text($"${item.UnitPrice:N2}");
                                    table.Cell().Text($"${(item.UnitPrice * item.Quantity):N2}");
                                }
                            });

                            column.Item().PaddingTop(15).AlignRight().Text($"TOTAL: ${order.TotalAmount:N2}").FontSize(14).Bold();
                        });
                    });

                    page.Footer().AlignCenter().Text(txt =>
                    {
                        txt.Span("Documento generado automáticamente - ");
                        txt.Span(DateTime.Now.ToString("dd/MM/yyyy HH:mm"));
                    });
                });
            }).GeneratePdf();
        }
    }
}
