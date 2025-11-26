using SalesService.Domain.Entities.OrderEntity;
using SharedKernel.IntegrationEvents.SalesEvents.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Infraestructure.EmailTemplates
{
    public static class EmailTemplateGenerator
    {
        public static string GenerateResetPasswordTemplate(string resetUrl)
        {
            return $@"
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='UTF-8'>
                    <title>Restablece tu contraseña</title>
                </head>
                <body style='font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 20px;'>
                    <table width='100%' cellspacing='0' cellpadding='0'>
                        <tr>
                            <td align='center'>
                                <table width='600' cellpadding='20' style='background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
                                    <tr>
                                        <td style='text-align: center;'>
                                            <h2 style='color: #333;'>Restablecimiento de contraseña</h2>
                                            <p style='color: #666; font-size: 15px;'>
                                                Recibimos una solicitud para restablecer tu contraseña.  
                                                Haz clic en el siguiente botón para continuar:
                                            </p>

                                            <a href='{resetUrl}' 
                                               style='display: inline-block; padding: 12px 20px; background: #4f46e5; color: white; 
                                                      text-decoration: none; border-radius: 6px; margin: 20px 0;'>
                                                Crear nueva contraseña
                                            </a>

                                            <p style='color: #999; font-size: 13px;'>
                                                Si no realizaste esta solicitud, ignora este mensaje.
                                            </p>

                                            <p style='color: #999; font-size: 13px; margin-top: 30px;'>
                                                Este enlace expirará en 15 minutos por razones de seguridad.
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                                <p style='font-size: 12px; color: #aaa; margin-top: 20px;'>
                                    © {DateTime.UtcNow.Year} - Tu Sistema
                                </p>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>";
        }
    }


}
