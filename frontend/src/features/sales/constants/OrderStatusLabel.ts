import { OrderStatus } from "../types/OrderTypes";

export const OrderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: "Pendiente",
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
};