import { OrderStatus } from "../../otherTypes/OrderType"

export const OrderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: "Pendiente",
  [OrderStatus.Issued]: "Emitido",
  [OrderStatus.Confirmed]: "Confirmado",
  [OrderStatus.InPreparation]: "En preparación",
  [OrderStatus.Prepared]: "Preparado", //Preparado es lo mismo que decir armado
  [OrderStatus.Invoiced]: "Facturado",
  [OrderStatus.Verify]: "Por verificar",
  [OrderStatus.OnTheWay]: "En camino",
  [OrderStatus.Delivered]: "Entregado",
  [OrderStatus.Canceled]: "Cancelado",
};
