using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Domain.Enums
{
    public enum OrderStatus
    {
        Pending, // Pendiente
        Issued,     // Emitido
        Confirmed,  // Confirmado por depósito
        InPreparation, // En preparacion
        Prepared,  // Preparado
        SentToBilling, // Enviado a facturar
        Invoiced,   // Facturado
        Verify,   // Verificado
        OnTheWay,   // En camino
        Delivered,  // Entregado
        Canceled,    // Cancelado por ventas
        PendingResolution, // Pendiente de resolución
        ReIssued, // Reemitido
        
    }
}   
