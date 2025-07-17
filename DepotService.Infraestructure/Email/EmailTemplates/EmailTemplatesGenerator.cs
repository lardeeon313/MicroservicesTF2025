using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Infraestructure.Email.EmailTemplates
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
            </html>";
        }
    }

}
