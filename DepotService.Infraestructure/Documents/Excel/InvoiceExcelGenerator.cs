using ClosedXML.Excel;
using DepotService.Domain.Entities;
using System;
using System.IO;

namespace DepotService.Infraestructure.Documents.Excel
{
    public class InvoiceExcelGenerator : IInvoiceExcelGenerator
    {
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

        public byte[] Generate(DepotOrderEntity order)
        {
            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Invoice");

            // === HEADER SECTION ===
            var titleCell = worksheet.Cell(1, 1);
            titleCell.Value = "FACTURA";
            titleCell.Style.Font.FontSize = 20;
            titleCell.Style.Font.Bold = true;
            titleCell.Style.Font.FontColor = XLColor.White;
            titleCell.Style.Fill.BackgroundColor = XLColor.FromHtml("#C0392B");
            titleCell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            titleCell.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
            worksheet.Range("A1:G1").Merge();
            worksheet.Row(1).Height = 35;

            // === INFORMACIÓN DEL PEDIDO Y CLIENTE ===
            int currentRow = 2;

            worksheet.Cell(currentRow, 1).Value = "Invoice ID:";
            worksheet.Cell(currentRow, 1).Style.Font.Bold = true;
            worksheet.Cell(currentRow, 2).Value = order.DepotOrderId;
            currentRow++;

            worksheet.Cell(currentRow, 1).Value = "Cliente:";
            worksheet.Cell(currentRow, 1).Style.Font.Bold = true;
            worksheet.Cell(currentRow, 2).Value = order.CustomerName;
            currentRow++;

            worksheet.Cell(currentRow, 1).Value = "Fecha:";
            worksheet.Cell(currentRow, 1).Style.Font.Bold = true;
            worksheet.Cell(currentRow, 2).Value = DateTime.UtcNow.ToString("dd/MM/yyyy");
            currentRow++;

            worksheet.Cell(currentRow, 1).Value = "Tipo de pago:";
            worksheet.Cell(currentRow, 1).Style.Font.Bold = true;
            worksheet.Cell(currentRow, 2).Value = GetPaymentTypeName((int)order.PaymentType!);
            currentRow++;


            // === DIRECCIÓN DE ENTREGA (SI EXISTE) ===
            if (order.DeliveryAddress != null)
            {
                worksheet.Cell(currentRow, 1).Value = "Dirección:";
                worksheet.Cell(currentRow, 1).Style.Font.Bold = true;
                worksheet.Cell(currentRow, 1).Style.Fill.BackgroundColor = XLColor.LightGray;
                worksheet.Cell(currentRow, 2).Value = $"{order.DeliveryAddress.Street} {order.DeliveryAddress.Number}" +
                    $"{(!string.IsNullOrEmpty(order.DeliveryAddress.Apartment) ? $", Dpto: {order.DeliveryAddress.Apartment}" : "")}";
                worksheet.Cell(currentRow, 2).Style.Fill.BackgroundColor = XLColor.LightGray;
                currentRow++;

                worksheet.Cell(currentRow, 2).Value = $"{order.DeliveryAddress.City}, {order.DeliveryAddress.Province}";
                worksheet.Cell(currentRow, 2).Style.Fill.BackgroundColor = XLColor.LightGray;
                currentRow++;

                worksheet.Cell(currentRow, 2).Value = $"C.P.: {order.DeliveryAddress.PostalCode ?? "N/D"}";
                worksheet.Cell(currentRow, 2).Style.Fill.BackgroundColor = XLColor.LightGray;
                currentRow++;
            }

            // === TABLE HEADER ===
            var headerRow = currentRow;
            var headers = new[] { "Item ID", "Producto", "Marca", "Embalaje", "Cantidad", "Precio unitario", "Total" };

            for (int i = 0; i < headers.Length; i++)
            {
                var cell = worksheet.Cell(headerRow, i + 1);
                cell.Value = headers[i];
                cell.Style.Font.Bold = true;
                cell.Style.Font.FontSize = 11;
                cell.Style.Font.FontColor = XLColor.White;
                cell.Style.Fill.BackgroundColor = XLColor.FromHtml("#27AE60");
                cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                cell.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
                cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            }
            worksheet.Row(headerRow).Height = 25;
            currentRow = headerRow + 1;

            // === DATA ROWS ===
            foreach (var item in order.Items)
            {
                var rowColor = (currentRow % 2 == 0) ? XLColor.FromHtml("#E8F8F5") : XLColor.FromHtml("#FADBD8");

                worksheet.Cell(currentRow, 1).Value = item.Id;
                worksheet.Cell(currentRow, 1).Style.Fill.BackgroundColor = rowColor;
                worksheet.Cell(currentRow, 1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

                worksheet.Cell(currentRow, 2).Value = item.ProductName;
                worksheet.Cell(currentRow, 2).Style.Fill.BackgroundColor = rowColor;

                worksheet.Cell(currentRow, 3).Value = item.ProductBrand;
                worksheet.Cell(currentRow, 3).Style.Fill.BackgroundColor = rowColor;

                worksheet.Cell(currentRow, 4).Value = item.PackagingType;
                worksheet.Cell(currentRow, 4).Style.Fill.BackgroundColor = rowColor;

                worksheet.Cell(currentRow, 5).Value = item.Quantity;
                worksheet.Cell(currentRow, 5).Style.Fill.BackgroundColor = rowColor;
                worksheet.Cell(currentRow, 5).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

                worksheet.Cell(currentRow, 6).Value = item.UnitPrice ?? 0;
                worksheet.Cell(currentRow, 6).Style.Fill.BackgroundColor = rowColor;
                worksheet.Cell(currentRow, 6).Style.NumberFormat.Format = "$#,##0.00";
                worksheet.Cell(currentRow, 6).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;

                worksheet.Cell(currentRow, 7).Value = item.Quantity * (item.UnitPrice ?? 0);
                worksheet.Cell(currentRow, 7).Style.Fill.BackgroundColor = rowColor;
                worksheet.Cell(currentRow, 7).Style.NumberFormat.Format = "$#,##0.00";
                worksheet.Cell(currentRow, 7).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;

                worksheet.Range(currentRow, 1, currentRow, 6).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                worksheet.Range(currentRow, 1, currentRow, 6).Style.Border.InsideBorder = XLBorderStyleValues.Thin;

                currentRow++;
            }

            // === TOTAL SECTION ===
            var totalRow = currentRow + 1;
            worksheet.Cell(totalRow, 5).Value = "Monto Total:";
            worksheet.Cell(totalRow, 5).Style.Font.Bold = true;
            worksheet.Cell(totalRow, 5).Style.Font.FontSize = 12;
            worksheet.Cell(totalRow, 5).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
            worksheet.Cell(totalRow, 5).Style.Fill.BackgroundColor = XLColor.FromHtml("#E74C3C");
            worksheet.Cell(totalRow, 5).Style.Font.FontColor = XLColor.White;

            worksheet.Cell(totalRow, 6).Value = order.TotalAmount;
            worksheet.Cell(totalRow, 6).Style.Font.Bold = true;
            worksheet.Cell(totalRow, 6).Style.Font.FontSize = 12;
            worksheet.Cell(totalRow, 6).Style.NumberFormat.Format = "$#,##0.00";
            worksheet.Cell(totalRow, 6).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
            worksheet.Cell(totalRow, 6).Style.Fill.BackgroundColor = XLColor.FromHtml("#E74C3C");
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
            worksheet.Column(7).Width = 18;

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }
    }
}
