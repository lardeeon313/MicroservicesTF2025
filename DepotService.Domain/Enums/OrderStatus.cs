using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Domain.Enums
{
    public enum OrderStatus
    {
        Received,         // Recibido desde ventas
        Assigned,         // Asignado a operario
        MissingProduct,   // Notificado falta
        ConfirmedToSales, // Confirmado a ventas
        SentToBilling     // Enviado a facturar
    }
}
