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
  [OrderStatus.PendingVerification]: "Pendiente de verificación",
  [OrderStatus.AssignedDelivery]: "Asignado a reparto",
  [OrderStatus.PendingDelivered]: "Pendiente de reparto",
  [OrderStatus.PendingIncidentResolution]: "Pedido con incidente",
  [OrderStatus.IncidentResolved]: "Incidente resuelto",
};