using DepotService.Domain.Entities;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DepotService.Infraestructure.Documents
{
    public class InvoicedOrdersByCustomerPdfGenerator : IInvoicedOrdersByCustomerPdfGenerator
    {
        public byte[] Generate(List<DepotOrderEntity> orders)
        {
            var doc = new InvoicedOrdersByCustomerDocument(orders);
            return doc.GeneratePdf();
        }
    }

    public class InvoicedOrdersByCustomerDocument : IDocument
    {
        private readonly List<DepotOrderEntity> _orders;
        private static readonly string ColorRojoOscuro = "#8B0000";
        private static readonly string ColorRojo = "#DC143C";
        private static readonly string ColorVerde = "#228B22";
        private static readonly string ColorNegro = "#1A1A1A";
        private static readonly string ColorVerdeClaro = "#90EE90";
        private static readonly string ColorRojoClaro = "#FFE5E5";
        private static readonly string ColorFondoTabla = "#F8F9FA";

        public InvoicedOrdersByCustomerDocument(List<DepotOrderEntity> orders)
        {
            _orders = orders.Where(o => o.TotalAmount > 0).ToList();
            
        }

        public DocumentMetadata GetMetadata() => new DocumentMetadata
        {
            Title = "Reporte de Pedidos Facturados por Cliente"
        };

        public void Compose(IDocumentContainer container)
        {
            string customerName = _orders.FirstOrDefault()?.CustomerName ?? "Cliente Desconocido";
            var totalAmount = _orders.Sum(o => o.TotalAmount);

            container.Page(page =>
            {
                page.Margin(30);
                page.Header().Element(header => ComposeHeader(header, customerName));
                page.Content().Element(content => ComposeContent(content, customerName, totalAmount));
                page.Footer().Element(ComposeFooter);
            });
        }

        private void ComposeHeader(IContainer container, string customerName)
        {
            container.Column(col =>
            {
                col.Item().Height(8).Background(ColorRojoOscuro);
                col.Item().PaddingVertical(15).Row(row =>
                {
                    row.RelativeItem().Column(column =>
                    {
                        column.Item().Text("Distribuidora Verona")
                            .FontSize(26)
                            .Bold()
                            .FontColor(ColorRojoOscuro);
                        column.Item().PaddingTop(5).Text($"Reporte de pedidos para: {customerName}")
                            .FontSize(13)
                            .FontColor(ColorNegro);
                        column.Item().PaddingTop(8).Text(text =>
                        {
                            text.Span("Fecha de generación: ").FontColor(Colors.Grey.Darken1).FontSize(10);
                            text.Span(DateTime.Now.ToString("dd/MM/yyyy HH:mm")).FontColor(ColorVerde).FontSize(10).SemiBold();
                        });
                    });
                    row.ConstantItem(80).Height(80)
                        .Border(3)
                        .BorderColor(ColorRojo)
                        .Background(ColorRojoClaro)
                        .AlignMiddle()
                        .AlignCenter()
                        .Text("LOGO")
                        .FontSize(16)
                        .Bold()
                        .FontColor(ColorRojoOscuro);
                });
                col.Item().PaddingTop(10).Row(row =>
                {
                    row.RelativeItem(2).Height(3).Background(ColorRojo);
                    row.RelativeItem(1).Height(3).Background(ColorVerde);
                    row.RelativeItem(2).Height(3).Background(ColorRojoOscuro);
                });
            });
        }

        private void ComposeContent(IContainer container, string customerName, decimal totalAmount)
        {
            container.PaddingTop(20).Column(col =>
            {
                col.Item().Element(content => ComposeTable(content, customerName, totalAmount));
            });
        }

        private void ComposeTable(IContainer container, string customerName, decimal totalAmount)
        {
            container.Table(table =>
            {
                table.ColumnsDefinition(cols =>
                {
                    cols.ConstantColumn(60);   // Nro Pedido
                    cols.ConstantColumn(120);  // Fecha de Emisión
                    cols.ConstantColumn(100);  // Cantidad de Productos
                    cols.RelativeColumn();     // Total
                });

                // Encabezados
                table.Header(header =>
                {
                    header.Cell().Background(ColorRojoOscuro).Padding(10)
                        .Text("NRO PEDIDO").FontColor(Colors.White).Bold().FontSize(10);
                    header.Cell().Background(ColorRojoOscuro).Padding(10)
                        .Text("FECHA DE EMISIÓN").FontColor(Colors.White).Bold().FontSize(10);
                    header.Cell().Background(ColorRojoOscuro).Padding(10)
                        .Text("CANTIDAD DE PRODUCTOS").FontColor(Colors.White).Bold().FontSize(10);
                    header.Cell().Background(ColorRojoOscuro).Padding(10)
                        .Text("TOTAL").FontColor(Colors.White).Bold().FontSize(10);
                });

                // Filas con alternancia de colores
                int index = 0;
                foreach (var order in _orders)
                {
                    bool isEven = index % 2 == 0;
                    int totalUnits = order.Items?.Sum(i => i.Quantity) ?? 0;

                    table.Cell().Background(isEven ? Colors.White : ColorFondoTabla).BorderBottom(1).BorderColor("#DEDEDE")
                        .Padding(9).AlignCenter().Text(order.DepotOrderId.ToString())
                        .FontSize(10).FontColor(ColorNegro);

                    table.Cell().Background(isEven ? Colors.White : ColorFondoTabla).BorderBottom(1).BorderColor("#DEDEDE")
                        .Padding(9).AlignCenter().Text(order.OrderDate.ToString("dd/MM/yyyy"))
                        .FontSize(10).FontColor(ColorNegro);

                    table.Cell().Background(isEven ? Colors.White : ColorFondoTabla).BorderBottom(1).BorderColor("#DEDEDE")
                        .Padding(9).AlignCenter().Text($"{totalUnits} {(totalUnits == 1 ? "unidad" : "unidades")}")
                        .FontSize(10).FontColor(ColorNegro);

                    table.Cell().Background(isEven ? Colors.White : ColorFondoTabla).BorderBottom(1).BorderColor("#DEDEDE")
                        .Padding(9).AlignRight().Text($"${order.TotalAmount:N2}")
                        .FontSize(10).Bold().FontColor(ColorVerde);

                    index++;
                }

                // Total general destacado
                table.Cell().ColumnSpan(3).Background(ColorRojoOscuro).Padding(10)
                    .Text("Total:")
                    .FontColor(Colors.White).Bold().FontSize(12).AlignRight();

                table.Cell().Background(ColorRojoOscuro).Padding(10)
                    .Text($"${totalAmount:N2}")
                    .FontColor(ColorVerdeClaro).Bold().FontSize(12).AlignRight();
            });
        }

        private void ComposeFooter(IContainer container)
        {
            container.Column(col =>
            {
                col.Item().PaddingBottom(10).Height(2).Background(ColorRojo);
                col.Item().Row(row =>
                {
                    row.RelativeItem().Text(text =>
                    {
                        text.Span("Distribuidora Verona © 2025").FontSize(9).FontColor(Colors.Grey.Darken1);
                    });
                    row.RelativeItem().AlignCenter().Text(text =>
                    {
                        text.Span("Página ").FontSize(9).FontColor(ColorNegro);
                        text.CurrentPageNumber().FontSize(9).Bold().FontColor(ColorRojo);
                        text.Span(" de ").FontSize(9).FontColor(ColorNegro);
                        text.TotalPages().FontSize(9).Bold().FontColor(ColorRojo);
                    });
                });
            });
        }
    }
}
