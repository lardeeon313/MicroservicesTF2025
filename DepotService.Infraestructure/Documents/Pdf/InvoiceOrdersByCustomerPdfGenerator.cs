using DepotService.Domain.Entities;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DepotService.Infraestructure.Documents
{
    // -----------------------------------------------------
    // GENERADOR DEL PDF (usa el documento)
    // -----------------------------------------------------
    // SEGUNDO REPORTE
    public class InvoicedOrdersByCustomerPdfGenerator : IInvoicedOrdersByCustomerPdfGenerator
    {
        public byte[] Generate(List<DepotOrderEntity> orders)
        {
            var doc = new InvoicedOrdersByCustomerDocument(orders);
            return doc.GeneratePdf();
        }
    }

    // -----------------------------------------------------
    // DOCUMENTO QUESTPDF
    // -----------------------------------------------------
    public class InvoicedOrdersByCustomerDocument : IDocument
    {
        private readonly List<DepotOrderEntity> _orders;

        // Paleta de colores: Rojo, Verde, Negro y Rojo Oscuro
        private static readonly string ColorRojoOscuro = "#8B0000";
        private static readonly string ColorRojo = "#DC143C";
        private static readonly string ColorVerde = "#228B22";
        private static readonly string ColorNegro = "#1A1A1A";
        private static readonly string ColorVerdeClaro = "#90EE90";
        private static readonly string ColorRojoClaro = "#FFE5E5";


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
            container.Page(page =>
            {
                page.Margin(30);

                page.Header().Element(ComposeHeader);

                page.Content().Element(ComposeContent);

                page.Footer().Element(ComposeFooter);
            });
        }

        // -----------------------
        // HEADER DEL DOCUMENTO
        // -----------------------
        private void ComposeHeader(IContainer container)
        {
            container.Column(col =>
            {
                // Barra superior decorativa
                col.Item().Height(8).Background(ColorRojoOscuro);

                col.Item().PaddingVertical(15).Row(row =>
                {
                    row.RelativeItem().Column(column =>
                    {
                        column.Item().Text("Distribuidora Verona")
                            .FontSize(26)
                            .Bold()
                            .FontColor(ColorRojoOscuro);

                        column.Item().PaddingTop(5).Text("Reporte de pedidos facturados por cliente")
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

                // Línea divisoria con degradado visual
                col.Item().PaddingTop(10).Row(row =>
                {
                    row.RelativeItem(2).Height(3).Background(ColorRojo);
                    row.RelativeItem(1).Height(3).Background(ColorVerde);
                    row.RelativeItem(2).Height(3).Background(ColorRojoOscuro);
                });
            });
        }

        // -----------------------
        // CONTENIDO PRINCIPAL
        // -----------------------
        private void ComposeContent(IContainer container)
        {
            container.PaddingTop(20).Column(col =>
            {
                // Resumen estadístico
                col.Item().PaddingBottom(15).Element(ComposeStats);

                // Título de la tabla
                col.Item().PaddingBottom(10).Background(ColorNegro).Padding(8).Text("Listado de pedidos")
                    .FontSize(16)
                    .Bold()
                    .FontColor(Colors.White);

                // Tabla
                col.Item().Element(ComposeTable);
            });
        }

        // -----------------------
        // ESTADÍSTICAS
        // -----------------------
        private void ComposeStats(IContainer container)
        {
            var totalOrders = _orders.Count;
            var totalAmount = _orders.Sum(o => o.TotalAmount);

            container.Row(row =>
            {
                row.RelativeItem().Element(c => StatCard(c, "Total Pedidos", totalOrders.ToString(), ColorRojoOscuro));
                row.Spacing(10);
                row.RelativeItem().Element(c => StatCard(c, "Monto Total", $"${totalAmount:N2}", ColorVerde));
                row.Spacing(10);
                row.RelativeItem().Element(c => StatCard(c, "Promedio", $"${(totalAmount / totalOrders):N2}", ColorRojo));
            });
        }

        private void StatCard(IContainer container, string label, string value, string color)
        {
            container
                .Border(2)
                .BorderColor(color)
                .Background(Colors.White)
                .Padding(12)
                .Column(col =>
                {
                    col.Item().Text(label).FontSize(10).FontColor(Colors.Grey.Darken2);
                    col.Item().PaddingTop(5).Text(value).FontSize(16).Bold().FontColor(color);
                });
        }

        // -----------------------
        // TABLA DE PEDIDOS
        // -----------------------
        private void ComposeTable(IContainer container)
        {
            container.Table(table =>
            {
                // Definir columnas (se agregó la última)
                table.ColumnsDefinition(cols =>
                {
                    cols.RelativeColumn(1);      // ID
                    cols.RelativeColumn(3);      // Cliente
                    cols.RelativeColumn(1.5f);   // Monto
                    cols.RelativeColumn(2);      // Fecha
                    cols.RelativeColumn(1);      // Productos (unidades)
                });

                // Encabezados
                table.Header(header =>
                {
                    header.Cell().Element(HeaderStyle).Text("Pedido").FontColor(Colors.White);
                    header.Cell().Element(HeaderStyle).Text("Cliente").FontColor(Colors.White);
                    header.Cell().Element(HeaderStyle).Text("Monto").FontColor(Colors.White);
                    header.Cell().Element(HeaderStyle).Text("Fecha").FontColor(Colors.White);
                    header.Cell().Element(HeaderStyle).Text("Productos").FontColor(Colors.White);
                });

                // Filas con alternancia de colores
                int index = 0;
                foreach (var order in _orders)
                {
                    bool isEven = index % 2 == 0;
                    int totalUnits = order.Items?.Sum(i => i.Quantity) ?? 0;

                    table.Cell().Element(c => CellStyle(c, isEven)).Text(order.DepotOrderId.ToString())
                        .FontSize(11).FontColor(ColorNegro);

                    table.Cell().Element(c => CellStyle(c, isEven)).Text(order.CustomerName)
                        .FontSize(11).FontColor(ColorNegro).Bold();

                    table.Cell().Element(c => CellStyle(c, isEven)).Text($"${order.TotalAmount:N2}")
                        .FontSize(11).FontColor(ColorVerde).SemiBold();

                    table.Cell().Element(c => CellStyle(c, isEven)).Text(order.OrderDate.ToString("dd/MM/yyyy HH:mm"))
                        .FontSize(10).FontColor(Colors.Grey.Darken2);

                    table.Cell().Element(c => CellStyle(c, isEven)).Text($"{totalUnits} unidades")
                        .FontSize(10).Bold().FontColor(ColorRojoOscuro);

                    index++;
                }
            });
        }

        // -----------------------
        // FOOTER DEL DOCUMENTO
        // -----------------------
        private void ComposeFooter(IContainer container)
        {
            container.Column(col =>
            {
                // Línea divisoria
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

        // -----------------------
        // ESTILOS
        // -----------------------
        private IContainer HeaderStyle(IContainer container)
        {
            return container
                .Background(ColorRojoOscuro)
                .Padding(10)
                .AlignCenter()
                .AlignMiddle();
        }

        private IContainer CellStyle(IContainer container, bool isEven)
        {
            return container
                .Background(isEven ? Colors.White : "#FAFAFA")
                .BorderBottom(1)
                .BorderColor("#E0E0E0")
                .Padding(8)
                .AlignMiddle();
        }
    }
}
