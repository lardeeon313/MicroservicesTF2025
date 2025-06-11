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
        ReReceived,      // Re recibido desde ventas
        Assigned,         // Asignado a operario
        InProgress,       // En proceso
        MissingProduct,   // Notificado falta
        SentToBilling,     // Enviado a facturar
        PendingResolution, // Pendiente de resolución
    }
}
