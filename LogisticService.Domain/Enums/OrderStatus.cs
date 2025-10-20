using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Domain.Enums
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
        Verified,   // Verificado
        OnTheWay,   // En camino
        Delivered,  // Entregado
        Canceled,    // Cancelado por ventas
        PendingResolution, // Pendiente de resolución
        ReIssued, // Reemitido
        PendingReissued, // Pendiente de reemisión
        PendingVerification, // Pendiente de verificación
        PendingDelivery, // Pendiente de reparto
        AssignmentCancelled, // Asignación cancelada
        AssignedDelivery, // Asignado a reparto
        PendingCashVerification, // Efectivo pendiente de verificacion
        CashVerified, // Efectivo Verificado,
        PendingIncidentResolution, // Pendiente de resolución de incidente
        IncidentResolved, // Incidente resuelto

    }   
}
