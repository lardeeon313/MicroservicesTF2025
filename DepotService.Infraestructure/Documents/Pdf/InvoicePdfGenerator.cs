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
                    page.Margin(40);
                    page.Size(PageSizes.A4);

                    // Header con diseño profesional
                    page.Header().Element(HeaderSection);

                    // Contenido principal
                    page.Content().Element(content => ContentSection(content, order));

                    // Footer mejorado
                    page.Footer().Element(FooterSection);
                });
            }).GeneratePdf();
        }

        private void HeaderSection(IContainer container)
        {
            container.Background(Colors.Grey.Lighten4)
                    .Padding(20)
                    .Column(column =>
                    {
                        column.Item()
                              .AlignCenter()
                              .Text("FACTURA")
                              .FontSize(28)
                              .Bold()
                              .FontColor(Colors.Red.Darken2);

                        column.Item()
                              .PaddingTop(5)
                              .Height(3)
                              .Background(Colors.Red.Darken2);
                    });
        }

        private void ContentSection(IContainer container, DepotOrderEntity order)
        {
            container.PaddingVertical(20)
                    .Column(column =>
                    {
                        column.Spacing(15);

                        // Información de la factura y cliente
                        column.Item().Element(content => InvoiceInfoSection(content, order));

                        // Separador
                        column.Item().PaddingVertical(10).LineHorizontal(2).LineColor(Colors.Grey.Medium);

                        // Tabla de productos
                        column.Item().Element(content => ProductsTable(content, order));

                        // Total
                        column.Item().Element(content => TotalSection(content, order));
                    });
        }

        private void InvoiceInfoSection(IContainer container, DepotOrderEntity order)
        {
            container.Row(row =>
            {
                // Información de la factura (lado izquierdo)
                row.RelativeItem()
                   .Background(Colors.Red.Lighten4)
                   .Padding(15)
                   .Column(column =>
                   {
                       column.Item().Text("INFORMACIÓN DE FACTURA")
                             .FontSize(12)
                             .Bold()
                             .FontColor(Colors.Red.Darken2);

                       column.Item().PaddingTop(8).Text($"Factura N°: {order.DepotOrderId}")
                             .FontSize(11)
                             .Bold();

                       column.Item().Text($"Fecha: {order.OrderDate:dd/MM/yyyy}")
                             .FontSize(10);

                       // 👇 Agregamos el tipo de pago aquí
                       column.Item().Text($"Tipo de pago: {GetPaymentTypeName(Convert.ToInt32(order.PaymentType))}")
                             .FontSize(10);
                   });

                row.ConstantItem(20); // Espacio entre columnas

                // Información del cliente (lado derecho)
                row.RelativeItem()
                   .Background(Colors.Grey.Lighten4)
                   .Padding(15)
                   .Column(column =>
                   {
                       column.Item().Text("INFORMACIÓN DEL CLIENTE")
                             .FontSize(12)
                             .Bold()
                             .FontColor(Colors.Grey.Darken2);

                       column.Item().PaddingTop(8).Text($"Cliente: {order.CustomerName ?? "N/D"}")
                             .FontSize(10)
                             .Bold();

                       column.Item().Text($"Email: {order.CustomerEmail ?? "N/D"}")
                             .FontSize(10);

                       column.Item().Text($"Teléfono: {order.PhoneNumber ?? "N/D"}")
                             .FontSize(10);

                       if (order.DeliveryAddress != null)
                       {
                           column.Item().PaddingTop(10).Text("Dirección de entrega")
                                 .FontSize(11)
                                 .Bold()
                                 .FontColor(Colors.Grey.Darken2);

                           column.Item().Text(
                               $"Calle: {order.DeliveryAddress.Street} {order.DeliveryAddress.Number}" +
                               $"{(!string.IsNullOrEmpty(order.DeliveryAddress.Apartment) ? $", Dpto: {order.DeliveryAddress.Apartment}" : "")}"
                           ).FontSize(10);

                           column.Item().Text(
                               $"Ciudad: {order.DeliveryAddress.City}, Provincia: {order.DeliveryAddress.Province}"
                           ).FontSize(10);

                           column.Item().Text(
                               $"Código Postal: {order.DeliveryAddress.PostalCode ?? "N/D"}"
                           ).FontSize(10);
                       }
                   });
            });
        }

        private void ProductsTable(IContainer container, DepotOrderEntity order)
        {
            container.Table(table =>
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
                    header.Cell().Background(Colors.Green.Darken1).Padding(10)
                          .Text("Producto").FontColor(Colors.White).FontSize(11).Bold();
                    header.Cell().Background(Colors.Green.Darken1).Padding(10)
                          .Text("Marca").FontColor(Colors.White).FontSize(11).Bold();
                    header.Cell().Background(Colors.Green.Darken1).Padding(10).AlignCenter()
                          .Text("Cant.").FontColor(Colors.White).FontSize(11).Bold();
                    header.Cell().Background(Colors.Green.Darken1).Padding(10).AlignRight()
                          .Text("P. Unitario").FontColor(Colors.White).FontSize(11).Bold();
                    header.Cell().Background(Colors.Green.Darken1).Padding(10).AlignRight()
                          .Text("Subtotal").FontColor(Colors.White).FontSize(11).Bold();
                });

                if (order.Items != null && order.Items.Any())
                {
                    var items = order.Items.ToArray();
                    for (int i = 0; i < items.Length; i++)
                    {
                        var item = items[i];
                        var backgroundColor = i % 2 == 0 ? Colors.White : Colors.Grey.Lighten5;

                        table.Cell().Background(backgroundColor).Padding(8)
                             .Text(item?.ProductName ?? "N/D").FontSize(10);
                        table.Cell().Background(backgroundColor).Padding(8)
                             .Text(item?.ProductBrand ?? "N/D").FontSize(10);
                        table.Cell().Background(backgroundColor).Padding(8).AlignCenter()
                             .Text(item?.Quantity.ToString() ?? "0").FontSize(10);
                        table.Cell().Background(backgroundColor).Padding(8).AlignRight()
                             .Text($"${(item?.UnitPrice ?? 0):N2}").FontSize(10);
                        table.Cell().Background(backgroundColor).Padding(8).AlignRight()
                             .Text($"${((item?.UnitPrice ?? 0) * (item?.Quantity ?? 0)):N2}")
                             .FontSize(10).Bold();
                    }
                }
                else
                {
                    table.Cell().ColumnSpan(5).Background(Colors.Red.Lighten4)
                         .Padding(20).AlignCenter()
                         .Text("No hay productos en esta orden")
                         .FontSize(12).Italic().FontColor(Colors.Red.Darken2);
                }
            });
        }

        private void TotalSection(IContainer container, DepotOrderEntity order)
        {
            container.PaddingTop(20)
                    .AlignRight()
                    .Width(200)
                    .Background(Colors.Red.Darken1)
                    .Padding(15)
                    .Column(column =>
                    {
                        column.Item()
                              .Text("TOTAL A PAGAR")
                              .FontColor(Colors.White)
                              .FontSize(12)
                              .Bold()
                              .AlignCenter();

                        column.Item()
                              .PaddingTop(5)
                              .Text($"${(order.TotalAmount > 0 ? order.TotalAmount : 0):N2}")
                              .FontColor(Colors.White)
                              .FontSize(20)
                              .Bold()
                              .AlignCenter();
                    });
        }

        private void FooterSection(IContainer container)
        {
            container.Background(Colors.Grey.Lighten4)
                    .Padding(10)
                    .Row(row =>
                    {
                        row.RelativeItem()
                           .Text("Documento generado automáticamente")
                           .FontSize(8)
                           .FontColor(Colors.Grey.Darken1);

                        row.RelativeItem()
                           .AlignRight()
                           .Text(text =>
                           {
                               text.DefaultTextStyle(TextStyle.Default.FontSize(8).FontColor(Colors.Grey.Darken1));
                               text.Span("Página ");
                               text.CurrentPageNumber();
                               text.Span(" de ");
                               text.TotalPages();
                               text.Span($" - {DateTime.Now:dd/MM/yyyy HH:mm}");
                           });
                    });
        }

        // 🔽 Mapeo del enum numérico al texto en español
        private string GetPaymentTypeName(int paymentType)
        {
            return paymentType switch
            {
                0 => "Transferencia",
                1 => "Tarjeta de crédito",
                2 => "Tarjeta de débito",
                3 => "Efectivo",
                4 => "Cuenta corriente",
                5 => "Cheque",
                6 => "Pagare",
                _ => "Desconocido"
            };
        }
    }
}
