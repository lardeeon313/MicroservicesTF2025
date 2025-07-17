using SalesService.Domain.Entities.OrderEntity;
using SharedKernel.IntegrationEvents.SalesEvents.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Infraestructure.Email.EmailTemplates
{
    public static class EmailTemplateGenerator
    {
        public static string Generate(string subject, string title, string recipientName, string bodyHtml)
        {
            return $@"
            <!DOCTYPE html>
            <html lang='es'>
            <head>
              <meta charset='UTF-8'>
              <title>{subject}</title>
            </head>
            <body style='font-family:Segoe UI, sans-serif;background-color:#f3f4f6;margin:0;padding:0;'>
              <div style='max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 0 10px rgba(0,0,0,0.05);'>

                <!-- Header -->
                <div style='background-color:#dc2626;padding:16px;text-align:center;'>
                  <img src='https://raw.githubusercontent.com/lardeeon313/MicroservicesTF2025/feature/milton-microservicestf2025/frontend/src/assets/logo-verona.png
' alt='Logo' style='height:50px;' />
                </div>

                <!-- Content -->
                <div style='padding:24px;color:#1f2937;'>
                  <h2 style='margin-top:0;'>{title}</h2>
                  <p>Hola <strong>{recipientName}</strong>,</p>
                  <div style='font-size:15px;line-height:1.6;'>
                    {bodyHtml}
                  </div>
                </div>

                <!-- Footer -->
                <div style='background-color:#f3f4f6;text-align:center;padding:16px;font-size:12px;color:#6b7280;'>
                  Este es un mensaje automático. Por favor, no responder a este correo.<br/>
                  &copy; {DateTime.UtcNow.Year} TuEmpresa. Todos los derechos reservados.
                </div>

              </div>
            </body>
            </html>
            ";
        }

        public static string BuildReissuedOrderTemplate(string customerName, int salesOrderId, string resolution, List<OrderItemsDto> items)
        {
            var itemsHtml = string.Join("", items.Select(i =>
                $"<tr><td>{i.ProductName}</td><td>{i.ProductBrand}</td><td>{i.Quantity}</td></tr>"
            ));

            return $@"
        <html>
        <body style='font-family: Arial, sans-serif; color: #333;'>
            <div style='max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>
                <img src='https://raw.githubusercontent.com/lardeeon313/MicroservicesTF2025/feature/milton-microservicestf2025/frontend/src/assets/logo-verona.png' alt='Verona Logo' style='max-width: 150px; display:block; margin:auto; margin-bottom:20px;'/>
                <h2 style='color: #e53935;'>Tu pedido fue reemitido</h2>
                <p>Hola <strong>{customerName}</strong>,</p>
                <p>Tu pedido <strong>#{salesOrderId}</strong> ha sido reemitido luego de revisar el inconveniente reportado.</p>
                <p><strong>Descripción de la resolución:</strong><br>{resolution}</p>
                <h3>Productos reenviados:</h3>
                <table style='width:100%; border-collapse: collapse;'>
                    <thead>
                        <tr style='background-color: #f5f5f5;'>
                            <th style='padding: 8px; border: 1px solid #ccc;'>Producto</th>
                            <th style='padding: 8px; border: 1px solid #ccc;'>Marca</th>
                            <th style='padding: 8px; border: 1px solid #ccc;'>Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>{itemsHtml}</tbody>
                </table>
                <p>Gracias por confiar en <strong>Verona</strong>. Si necesitás ayuda, respondé a este email.</p>
            </div>
        </body>
        </html>";
        }

        public static string BuildOrderRegisteredTemplate(string customerName, int orderId, DateTime orderDate, DateTime? deliveryDate, string deliveryDetail, List<OrderItem> items)
        {
            var itemsHtml = string.Join("", items.Select(i =>
                $"<tr><td>{i.ProductName}</td><td>{i.ProductBrand}</td><td>{i.Quantity}</td></tr>"
            ));

            return $@"
            <html>
            <body style='font-family: Arial, sans-serif; color: #333;'>
                <div style='max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>
                    <img src='https://raw.githubusercontent.com/lardeeon313/MicroservicesTF2025/feature/milton-microservicestf2025/frontend/src/assets/logo-verona.png' alt='Verona Logo' style='max-width: 150px; display:block; margin:auto; margin-bottom:20px;'/>
                    <h2 style='color: #e53935;'>¡Pedido registrado con éxito!</h2>
                    <p>Hola <strong>{customerName}</strong>,</p>
                    <p>Gracias por tu compra. Hemos registrado tu pedido <strong>#{orderId}</strong> el <strong>{orderDate:dd/MM/yyyy}</strong>.</p>
                    <p><strong>Fecha estimada de entrega:</strong> {deliveryDate?.ToString("dd/MM/yyyy") ?? "Por confirmar"}</p>
                    <p><strong>Detalle de entrega:</strong><br>{deliveryDetail}</p>
                    <h3>Productos pedidos:</h3>
                    <table style='width:100%; border-collapse: collapse;'>
                        <thead>
                            <tr style='background-color: #f5f5f5;'>
                                <th style='padding: 8px; border: 1px solid #ccc;'>Producto</th>
                                <th style='padding: 8px; border: 1px solid #ccc;'>Marca</th>
                                <th style='padding: 8px; border: 1px solid #ccc;'>Cantidad</th>
                            </tr>
                        </thead>
                        <tbody>{itemsHtml}</tbody>
                    </table>
                    <p>Nos pondremos en contacto cuando el pedido esté listo para su entrega.</p>
                    <p>Gracias por elegir <strong>Verona</strong>.</p>
                </div>
            </body>
            </html>";
        }
    }


}
