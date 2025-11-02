import { OrderStatus } from "../types/OrderTypes";

export const OrderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: "Pendiente",
  [OrderStatus.SentToBilling]: "Enviado a facturación",
  [OrderStatus.PendingResolution]: "Pendiente resolución",
  [OrderStatus.PendingReissued]: "Pendiente reemisión",
  [OrderStatus.Issued]: "Emitido",
  [OrderStatus.ReIssued]: "Reemitido",
  [OrderStatus.Confirmed]: "Confirmado",
  [OrderStatus.InPreparation]: "En preparación",
  [OrderStatus.Prepared]: "Preparado",
  [OrderStatus.Invoiced]: "Facturado",
  [OrderStatus.Verify]: "Por verificar",
  [OrderStatus.OnTheWay]: "En camino",
  [OrderStatus.Delivered]: "Entregado",
  [OrderStatus.Canceled]: "Cancelado",
  [OrderStatus.Modified]: "Modificado",
  [OrderStatus.Verified] : "Verificado por tesoreria",
  [OrderStatus.PendingCashVerification] : "Efectivo pendiente de verificacion",
  [OrderStatus.PendingDelivery] : "Pendiente de reparto",
  [OrderStatus.AssignmentCancelled] : "Pedido cancelado por repartidor",
  [OrderStatus.AssignedDelivery] : "Asignado a reparto",
  [OrderStatus.PendingVerification] : "Pendiente de verificacion",
  [OrderStatus.CashVerified] : "Efectivo verificado",
  [OrderStatus.PendingIncidentResolution] : "Pendiente de resolucion de incidente",
  [OrderStatus.IncidentResolved] : "Incidente resuelto"
};