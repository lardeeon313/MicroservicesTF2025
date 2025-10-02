using ClosedXML.Excel;
using DepotService.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Infraestructure.Documents.Excel
{
    public class InvoiceExcelGenerator : IInvoiceExcelGenerator
    {
        public byte[] Generate(DepotOrderEntity order)
        {
            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Invoice");

            // === HEADER SECTION ===
            // Título principal
            var titleCell = worksheet.Cell(1, 1);
            titleCell.Value = "FACTURA";
            titleCell.Style.Font.FontSize = 20;
            titleCell.Style.Font.Bold = true;
            titleCell.Style.Font.FontColor = XLColor.White;
            titleCell.Style.Fill.BackgroundColor = XLColor.FromHtml("#C0392B"); // Rojo oscuro
            titleCell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            titleCell.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
            worksheet.Range("A1:F1").Merge();
            worksheet.Row(1).Height = 35;

            // Información del pedido
            worksheet.Cell(2, 1).Value = "Invoice ID:";
            worksheet.Cell(2, 1).Style.Font.Bold = true;
            worksheet.Cell(2, 2).Value = order.DepotOrderId;

            worksheet.Cell(3, 1).Value = "Cliente:";
            worksheet.Cell(3, 1).Style.Font.Bold = true;
            worksheet.Cell(3, 2).Value = order.CustomerName;

            worksheet.Cell(4, 1).Value = "Fecha:";
            worksheet.Cell(4, 1).Style.Font.Bold = true;
            worksheet.Cell(4, 2).Value = DateTime.UtcNow.ToString("dd/MM/yyyy");

            // === TABLE HEADER ===
            var headerRow = 6;
            var headers = new[] { "Item ID", "Producto", "Marca", "Cantidad", "Precio unitario", "Total" };

            for (int i = 0; i < headers.Length; i++)
            {
                var cell = worksheet.Cell(headerRow, i + 1);
                cell.Value = headers[i];
                cell.Style.Font.Bold = true;
                cell.Style.Font.FontSize = 11;
                cell.Style.Font.FontColor = XLColor.White;
                cell.Style.Fill.BackgroundColor = XLColor.FromHtml("#27AE60"); // Verde
                cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                cell.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
                cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            }
            worksheet.Row(headerRow).Height = 25;

            // === DATA ROWS ===
            var row = 7;
            foreach (var item in order.Items)
            {
                // Aplicar color alternado a las filas (tonos suaves de verde y rojo)
                var rowColor = (row % 2 == 0) ? XLColor.FromHtml("#E8F8F5") : XLColor.FromHtml("#FADBD8"); // Verde claro / Rojo claro

                worksheet.Cell(row, 1).Value = item.Id;
                worksheet.Cell(row, 1).Style.Fill.BackgroundColor = rowColor;
                worksheet.Cell(row, 1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

                worksheet.Cell(row, 2).Value = item.ProductName;
                worksheet.Cell(row, 2).Style.Fill.BackgroundColor = rowColor;

                worksheet.Cell(row, 3).Value = item.ProductBrand;
                worksheet.Cell(row, 3).Style.Fill.BackgroundColor = rowColor;

                worksheet.Cell(row, 4).Value = item.Quantity;
                worksheet.Cell(row, 4).Style.Fill.BackgroundColor = rowColor;
                worksheet.Cell(row, 4).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

                worksheet.Cell(row, 5).Value = item.UnitPrice ?? 0;
                worksheet.Cell(row, 5).Style.Fill.BackgroundColor = rowColor;
                worksheet.Cell(row, 5).Style.NumberFormat.Format = "$#,##0.00";
                worksheet.Cell(row, 5).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;

                worksheet.Cell(row, 6).Value = (item.Quantity * (item.UnitPrice ?? 0));
                worksheet.Cell(row, 6).Style.Fill.BackgroundColor = rowColor;
                worksheet.Cell(row, 6).Style.NumberFormat.Format = "$#,##0.00";
                worksheet.Cell(row, 6).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;

                // Bordes para cada celda
                worksheet.Range(row, 1, row, 6).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                worksheet.Range(row, 1, row, 6).Style.Border.InsideBorder = XLBorderStyleValues.Thin;

                row++;
            }

            // === TOTAL SECTION ===
            var totalRow = row + 1;
            worksheet.Cell(totalRow, 5).Value = "Monto Total:";
            worksheet.Cell(totalRow, 5).Style.Font.Bold = true;
            worksheet.Cell(totalRow, 5).Style.Font.FontSize = 12;
            worksheet.Cell(totalRow, 5).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
            worksheet.Cell(totalRow, 5).Style.Fill.BackgroundColor = XLColor.FromHtml("#E74C3C"); // Rojo
            worksheet.Cell(totalRow, 5).Style.Font.FontColor = XLColor.White;

            worksheet.Cell(totalRow, 6).Value = order.TotalAmount;
            worksheet.Cell(totalRow, 6).Style.Font.Bold = true;
            worksheet.Cell(totalRow, 6).Style.Font.FontSize = 12;
            worksheet.Cell(totalRow, 6).Style.NumberFormat.Format = "$#,##0.00";
            worksheet.Cell(totalRow, 6).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
            worksheet.Cell(totalRow, 6).Style.Fill.BackgroundColor = XLColor.FromHtml("#E74C3C"); // Rojo
            worksheet.Cell(totalRow, 6).Style.Font.FontColor = XLColor.White;

            worksheet.Range(totalRow, 5, totalRow, 6).Style.Border.OutsideBorder = XLBorderStyleValues.Medium;
            worksheet.Row(totalRow).Height = 25;

            // === COLUMN WIDTHS ===
            worksheet.Column(1).Width = 12;
            worksheet.Column(2).Width = 25;
            worksheet.Column(3).Width = 20;
            worksheet.Column(4).Width = 12;
            worksheet.Column(5).Width = 18;
            worksheet.Column(6).Width = 15;

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }
    }
}