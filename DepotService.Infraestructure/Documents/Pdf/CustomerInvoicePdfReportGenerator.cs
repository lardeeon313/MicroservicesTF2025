using DepotService.Domain.Entities;
using DepotService.Infraestructure.Documents;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;

public class InvoicedOrdersReportPdfGenerator : IInvoicedOrdersReportPdfGenerator
{
    // PALETA DE COLORES: Rojo, Verde, Negro y Rojo Oscuro
    private static class ReportStyles
    {
        public static readonly string RojoOscuro = "#8B0000";     // Rojo oscuro principal
        public static readonly string Rojo = "#DC143C";         // Rojo vibrante
        public static readonly string Verde = "#228B22";        // Verde forest
        public static readonly string VerdeClaro = "#90EE90";   // Verde claro
        public static readonly string Negro = "#1A1A1A";        // Negro
        public static readonly string GrisOscuro = "#2D2D2D";   // Gris muy oscuro
        public static readonly string GrisClaro = "#F5F5F5";    // Gris claro
        public static readonly string Blanco = "#FFFFFF";       // Blanco
        public static readonly string RojoClaro = "#FFE5E5";    // Rojo muy claro
    }

    public InvoicedOrdersReportPdfGenerator()
    {
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public byte[] Generate(List<DepotOrderEntity> orders)
    {
        if (orders == null)
            throw new ArgumentNullException(nameof(orders));

        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Margin(35);
                page.Size(PageSizes.A4);
                page.Header().Element(header => ComposeHeader(header, orders.Count));
                page.Content().PaddingVertical(20).Element(content => BuildContent(content, orders));
                page.Footer().Element(ComposeFooter);
            });
        }).GeneratePdf();
    }

    // ========================================
    // HEADER MEJORADO
    // ========================================
    private void ComposeHeader(IContainer container, int totalOrders)
    {
        container.Column(column =>
        {
            // Barra decorativa superior con tres colores
            column.Item().Row(row =>
            {
                row.RelativeItem(2).Height(10).Background(ReportStyles.RojoOscuro);
                row.RelativeItem(1).Height(10).Background(ReportStyles.Verde);
                row.RelativeItem(2).Height(10).Background(ReportStyles.Rojo);
            });

            // Contenido del header
            column.Item().PaddingVertical(20).Row(row =>
            {
                // Lado izquierdo
                row.RelativeItem().Column(col =>
                {
                    col.Item().Text("DISTRIBUIDORA VERONA")
                        .FontSize(22)
                        .Bold()
                        .FontColor(ReportStyles.RojoOscuro);
                    col.Item().PaddingTop(5).Text("Reporte de Ingresos por Cliente")
                        .FontSize(14)
                        .SemiBold()
                        .FontColor(ReportStyles.Negro);
                    col.Item().PaddingTop(10).Row(infoRow =>
                    {
                        infoRow.AutoItem().Width(120).Background(ReportStyles.RojoClaro)
                            .Border(2).BorderColor(ReportStyles.Rojo)
                            .Padding(8).Column(statCol =>
                            {
                                statCol.Item().Text("Total Órdenes")
                                    .FontSize(8).FontColor(ReportStyles.GrisOscuro);
                                statCol.Item().AlignCenter().Text(totalOrders.ToString())
                                    .FontSize(18).Bold().FontColor(ReportStyles.RojoOscuro);
                            });
                    });
                });

                // Lado derecho
                row.ConstantItem(130).Column(col =>
                {
                    // Logo
                    col.Item().Height(80).Width(120)
                        .Border(3).BorderColor(ReportStyles.Rojo)
                        .Background(ReportStyles.RojoClaro)
                        .AlignCenter().AlignMiddle()
                        .Text("LOGO")
                        .FontSize(18).Bold().FontColor(ReportStyles.RojoOscuro);

                    // Fecha
                    col.Item().PaddingTop(10).Background(ReportStyles.Negro)
                        .Padding(8).Column(dateCol =>
                        {
                            dateCol.Item().AlignCenter().Text(DateTime.Now.ToString("dd/MM/yyyy"))
                                .FontSize(12).Bold().FontColor(ReportStyles.Blanco);
                            dateCol.Item().AlignCenter().Text(DateTime.Now.ToString("HH:mm"))
                                .FontSize(10).FontColor(ReportStyles.VerdeClaro);
                        });
                });
            });

            // Línea separadora inferior
            column.Item().Height(3).Background(ReportStyles.Verde);
        });
    }

    // ========================================
    // CONTENIDO PRINCIPAL
    // ========================================
    private void BuildContent(IContainer container, List<DepotOrderEntity> orders)
    {
        var totalAmount = orders.Sum(o => o.TotalAmount);
        var totalClients = orders.Select(o => o.CustomerName).Distinct().Count();

        container.Column(column =>
        {
            // Tarjetas de estadísticas
            column.Item().PaddingBottom(20).Row(row =>
            {
                row.RelativeItem().Element(c => StatCard(c, "Monto Total", $"${totalAmount:N2}", ReportStyles.Verde));
                row.Spacing(15);
                row.RelativeItem().Element(c => StatCard(c, "Promedio", $"${(orders.Count > 0 ? totalAmount / orders.Count : 0):N2}", ReportStyles.Rojo));
                row.Spacing(15);
                row.RelativeItem().Element(c => StatCard(c, "Clientes", totalClients.ToString(), ReportStyles.RojoOscuro));
            });

            // Título de la tabla
            column.Item().PaddingBottom(10).Background(ReportStyles.Negro).Padding(10)
                .Text("DETALLE DE INGRESOS POR CLIENTE")
                .FontSize(14).Bold().FontColor(ReportStyles.Blanco);

            // Tabla de órdenes
            column.Item().Element(content => BuildTable(content, orders));

            // Total general destacado
            column.Item().PaddingTop(3).Element(content => BuildTotalSection(content, totalAmount, totalClients));
        });
    }

    // ========================================
    // TARJETA DE ESTADÍSTICA
    // ========================================
    private void StatCard(IContainer container, string label, string value, string color)
    {
        container.Border(2).BorderColor(color)
            .Background(ReportStyles.Blanco)
            .Padding(12)
            .Column(col =>
            {
                col.Item().Text(label)
                    .FontSize(9).FontColor(ReportStyles.GrisOscuro);
                col.Item().PaddingTop(5).AlignCenter().Text(value)
                    .FontSize(16).Bold().FontColor(color);
            });
    }

    // ========================================
    // TABLA DE ÓRDENES
    // ========================================
    private void BuildTable(IContainer container, List<DepotOrderEntity> orders)
    {
        // Agrupar órdenes por cliente
        var groupedOrders = orders
            .GroupBy(o => new { o.CustomerName, o.CustomerEmail })
            .Select(g => new
            {
                CustomerName = g.Key.CustomerName,
                CustomerEmail = g.Key.CustomerEmail,
                TotalOrders = g.Count(),
                TotalIncome = g.Sum(o => o.TotalAmount)
            })
            .ToList();

        container.Table(table =>
        {
            table.ColumnsDefinition(cols =>
            {
                cols.RelativeColumn(2.5f);     // Cliente
                cols.RelativeColumn(3f);       // Email
                cols.ConstantColumn(85);       // Total de Pedidos
                cols.ConstantColumn(95);       // Total de Ingresos
            });

            // HEADER con gradiente visual usando los tres colores
            table.Header(header =>
            {
                header.Cell().Background(ReportStyles.RojoOscuro).Padding(10)
                    .Text("CLIENTE").FontColor(ReportStyles.Blanco).Bold().FontSize(10);
                header.Cell().Background(ReportStyles.RojoOscuro).Padding(10)
                    .Text("EMAIL").FontColor(ReportStyles.Blanco).Bold().FontSize(10);
                header.Cell().Background(ReportStyles.RojoOscuro).Padding(10)
                    .AlignCenter().Text("TOTAL DE PEDIDOS").FontColor(ReportStyles.Blanco).Bold().FontSize(10);
                header.Cell().Background(ReportStyles.RojoOscuro).Padding(10)
                    .AlignRight().Text("TOTAL DE INGRESOS").FontColor(ReportStyles.Blanco).Bold().FontSize(10);
            });

            // FILAS con estilos alternados
            int index = 0;
            foreach (var group in groupedOrders)
            {
                bool isEven = index % 2 == 0;
                var bg = isEven ? ReportStyles.Blanco : ReportStyles.GrisClaro;

                table.Cell().Background(bg).BorderBottom(1).BorderColor("#DEDEDE")
                    .Padding(9).Text(group.CustomerName ?? "-")
                    .FontSize(10).FontColor(ReportStyles.Negro);

                table.Cell().Background(bg).BorderBottom(1).BorderColor("#DEDEDE")
                    .Padding(9).Text(group.CustomerEmail ?? "-")
                    .FontSize(9).FontColor(ReportStyles.GrisOscuro);

                table.Cell().Background(bg).BorderBottom(1).BorderColor("#DEDEDE")
                    .Padding(9).AlignCenter().Text(group.TotalOrders.ToString())
                    .FontSize(10).FontColor(ReportStyles.Negro);

                table.Cell().Background(bg).BorderBottom(1).BorderColor("#DEDEDE")
                    .Padding(9).AlignRight().Text($"${group.TotalIncome:N2}")
                    .FontSize(10).Bold().FontColor(ReportStyles.Verde);

                index++;
            }
        });
    }

    // ========================================
    // SECCIÓN DE TOTAL
    // ========================================
    private void BuildTotalSection(IContainer container, decimal totalAmount, int totalClients)
    {
        container.Row(row =>
        {
            // Barra decorativa izquierda
            row.ConstantItem(8).Background(ReportStyles.Verde);

            // Contenido del total
            row.RelativeItem().Background(ReportStyles.RojoOscuro).Padding(15).Row(innerRow =>
            {
                innerRow.RelativeItem().Text($"Mostrando {totalClients} clientes")
                    .FontColor(ReportStyles.Blanco).FontSize(12);

                innerRow.RelativeItem().AlignRight().Text("TOTAL:")
                    .FontColor(ReportStyles.Blanco).Bold().FontSize(14);

                innerRow.ConstantItem(150).AlignRight().Text($"${totalAmount:N2}")
                    .FontColor(ReportStyles.VerdeClaro).Bold().FontSize(16);
            });

            // Barra decorativa derecha
            row.ConstantItem(8).Background(ReportStyles.Rojo);
        });
    }

    // ========================================
    // FOOTER
    // ========================================
    private void ComposeFooter(IContainer container)
    {
        container.Column(col =>
        {
            // Línea decorativa superior
            col.Item().PaddingBottom(10).Row(row =>
            {
                row.RelativeItem(1).Height(2).Background(ReportStyles.Rojo);
                row.RelativeItem(2).Height(2).Background(ReportStyles.Verde);
                row.RelativeItem(1).Height(2).Background(ReportStyles.RojoOscuro);
            });

            // Contenido del footer
            col.Item().Background(ReportStyles.Negro).Padding(12).Row(row =>
            {
                row.RelativeItem().Text("Distribuidora Verona © 2025")
                    .FontSize(9).FontColor(ReportStyles.Blanco);

                row.RelativeItem().AlignCenter().Text(text =>
                {
                    text.Span("Página ").FontSize(9).FontColor(ReportStyles.Blanco);
                    text.CurrentPageNumber().FontSize(9).Bold().FontColor(ReportStyles.VerdeClaro);
                    text.Span(" de ").FontSize(9).FontColor(ReportStyles.Blanco);
                    text.TotalPages().FontSize(9).Bold().FontColor(ReportStyles.VerdeClaro);
                });

                row.RelativeItem().AlignRight().Text("Documento generado automáticamente")
                    .FontSize(9).FontColor(ReportStyles.Blanco).Italic();
            });
        });
    }
}
