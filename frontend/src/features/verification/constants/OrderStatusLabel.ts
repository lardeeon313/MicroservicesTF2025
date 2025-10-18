import { OrderStatus } from '../types/OrderTypes';

export const OrderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: 'Pendiente',
  [OrderStatus.Issued]: 'Emitido',
  [OrderStatus.Confirmed]: 'Confirmado por depósito',
  [OrderStatus.InPreparation]: 'En preparación',
  [OrderStatus.Prepared]: 'Preparado',
  [OrderStatus.SentToBilling]: 'Enviado a facturar',
  [OrderStatus.Invoiced]: 'Facturado',
  [OrderStatus.Verified]: 'Verificado',
  [OrderStatus.OnTheWay]: 'En camino',
  [OrderStatus.Delivered]: 'Entregado',
  [OrderStatus.Canceled]: 'Cancelado por ventas',
  [OrderStatus.PendingResolution]: 'Pendiente de resolución',
  [OrderStatus.ReIssued]: 'Reemitido',
  [OrderStatus.PendingReissued]: 'Pendiente de reemisión',
  [OrderStatus.PendingVerification]: 'Pendiente de verificación',
  [OrderStatus.AssignedDelivery]: 'Asignado a reparto',
  [OrderStatus.PendingCashVerification]: 'Efectivo pendiente de verificación',
  [OrderStatus.CashVerified]: 'Efectivo Verificado',
};