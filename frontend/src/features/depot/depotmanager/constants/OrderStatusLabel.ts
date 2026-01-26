import { OrderStatus } from '../types/OrderTypes';

// Etiquetas alineadas con DepotService.Domain.Enums.OrderStatus y los estados de ventas/verificación
export const OrderStatusLabels: Record<OrderStatus | string | number, string> = {
  [OrderStatus.Received]: 'Recibido',
  [OrderStatus.ReReceived]: 'Re-Recibido',
  [OrderStatus.Assigned]: 'Asignado a operario',
  [OrderStatus.InPreparation]: 'En preparación',
  [OrderStatus.MissingProduct]: 'Notificado falta',
  [OrderStatus.SentToBilling]: 'Enviado a facturar',
  [OrderStatus.PendingResolution]: 'Pendiente de resolución',
  [OrderStatus.Prepared]: 'Preparado',
  [OrderStatus.Invoiced]: 'Facturado',
  [OrderStatus.Issued]: 'Emitido',
  [OrderStatus.Cancelled]: 'Cancelado',
  [OrderStatus.Deleted]: 'Eliminado',
  [OrderStatus.Verify]: 'Verificado',
  [OrderStatus.OnTheWay]: 'En camino',
  [OrderStatus.Delivered]: 'Entregado',
  [OrderStatus.PendingVerification]: 'Pendiente de verificación',
  [OrderStatus.AssignedDelivery]: 'Asignado a reparto',
  [OrderStatus.PendingDelivered]: 'Pendiente de reparto',
  [OrderStatus.PendingIncidentResolution]: 'Pendiente de resolución de incidente',
  [OrderStatus.IncidentResolved]: 'Incidente resuelto',

  // Alias de string por compatibilidad con flujos de ventas/verificación
  pending: 'Pendiente',
  issued: 'Emitido',
  confirmed: 'Confirmado por depósito',
  inPreparation: 'En preparación',
  prepared: 'Preparado',
  sentToBilling: 'Enviado a facturar',
  invoiced: 'Facturado',
  verified: 'Verificado',
  onTheWay: 'En camino',
  delivered: 'Entregado',
  canceled: 'Cancelado',
  pendingResolution: 'Pendiente de resolución',
  reIssued: 'Reemitido',
  pendingReissued: 'Pendiente de reemisión',
  pendingVerification: 'Pendiente de verificación',
  assignedDelivery: 'Asignado a reparto',
  pendingDelivery: 'Pendiente de reparto',
  pendingCashVerification: 'Efectivo pendiente de verificación',
  cashVerified: 'Efectivo verificado',
  pendingIncidentResolution: 'Pendiente de resolución de incidente',
  incidentResolved: 'Incidente resuelto',
};

// Alias para compatibilidad con import { OrderStatusLabel }
export const OrderStatusLabel = OrderStatusLabels;