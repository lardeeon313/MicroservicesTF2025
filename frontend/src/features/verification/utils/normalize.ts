import { OrderStatus, DeliveryPriority } from '../types/OrderTypes';

export function normalizeOrderStatus(s: any): OrderStatus | undefined {
  if (typeof s === 'number') return s as OrderStatus;
  if (typeof s === 'string') {
    const parsed = Number(s);
    if (!isNaN(parsed)) return parsed as OrderStatus;

    const map: { [key: string]: OrderStatus } = {
      'pendiente de verificación': OrderStatus.PendingVerification,
      'pendingverification': OrderStatus.PendingVerification,
      'asignado a reparto': OrderStatus.AssignedDelivery,
      'assigneddelivery': OrderStatus.AssignedDelivery,
      'verificado': OrderStatus.Verified,
      'verified': OrderStatus.Verified,
      'pendiente': OrderStatus.Pending,
      'pending': OrderStatus.Pending,
      'emitido': OrderStatus.Issued,
      'issued': OrderStatus.Issued,
      'confirmado': OrderStatus.Confirmed,
      'confirmed': OrderStatus.Confirmed,
      'en preparacion': OrderStatus.InPreparation,
      'inpreparation': OrderStatus.InPreparation,
      'preparado': OrderStatus.Prepared,
      'prepared': OrderStatus.Prepared,
      'enviado a facturar': OrderStatus.SentToBilling,
      'senttobilling': OrderStatus.SentToBilling,
      'facturado': OrderStatus.Invoiced,
      'invoiced': OrderStatus.Invoiced,
      'en camino': OrderStatus.OnTheWay,
      'ontheway': OrderStatus.OnTheWay,
      'entregado': OrderStatus.Delivered,
      'delivered': OrderStatus.Delivered,
      'cancelado': OrderStatus.Canceled,
      'canceled': OrderStatus.Canceled,
      'efectivo pendiente de verificación': OrderStatus.PendingCashVerification,
      'pendingcashverification': OrderStatus.PendingCashVerification,
      'efectivo verificado': OrderStatus.CashVerified,
      'cashverified': OrderStatus.CashVerified,
      'pendiente de resolución de incidente': OrderStatus.PendingIncidentResolution,
      'pendingincidentresolution': OrderStatus.PendingIncidentResolution,
      'incidente resuelto': OrderStatus.IncidentResolved,
      'incidentresolved': OrderStatus.IncidentResolved,
      'asignación cancelada': OrderStatus.AssignmentCancelled,
      'assignmentcancelled': OrderStatus.AssignmentCancelled,
      'pendiente de reparto': OrderStatus.PendingDelivery,
      'pendingdelivery': OrderStatus.PendingDelivery,
    };
    const key = s.toLowerCase().trim();
    if (map[key] !== undefined) return map[key];
    // @ts-ignore
    const enumVal = OrderStatus[s as keyof typeof OrderStatus];
    if (typeof enumVal === 'number') return enumVal as OrderStatus;
  }
  return undefined;
}

import { getPaymentTypeLabel } from '../constants/PaymentTypeLabel';

export function normalizePaymentType(paymentType: any): string {
  if (paymentType === null || paymentType === undefined) return '';
  return getPaymentTypeLabel(paymentType);
}

export function normalizeDeliveryPriority(p: any): DeliveryPriority | undefined {
  if (p === 0 || p === 1 || p === 2) return p as DeliveryPriority;
  if (typeof p === 'number') return p as DeliveryPriority;
  if (typeof p === 'string') {
    const parsed = Number(p);
    if (!isNaN(parsed)) return parsed as DeliveryPriority;
    const map: { [key: string]: DeliveryPriority } = {
      'low': DeliveryPriority.Low,
      'baja': DeliveryPriority.Low,
      'medium': DeliveryPriority.Medium,
      'media': DeliveryPriority.Medium,
      'high': DeliveryPriority.High,
      'alta': DeliveryPriority.High,
    };
    const k = p.toLowerCase().trim();
    if (map[k] !== undefined) return map[k];
  }
  return undefined;
}


