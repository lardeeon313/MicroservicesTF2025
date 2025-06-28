//import { OrderStatus } from "../../otherTypes/OrderType"
import { DepotOrderStatus } from "../types/OrderDTO";

export const OrderStatusLabels: Record<DepotOrderStatus, string> = {
  [DepotOrderStatus.Received]: "Recibido",
  [DepotOrderStatus.ReReceived]: "Modificado por faltantes",
  [DepotOrderStatus.Assigned]: "Asignado",
  [DepotOrderStatus.InPreparation]: "En preparación",
  [DepotOrderStatus.MissingProduct]: "Pedido con faltante/s",
  [DepotOrderStatus.SentToBilling]: "Listo para Facturar",
  [DepotOrderStatus.PendingResolution]: "Pendiente de resolución",
  [DepotOrderStatus.Prepared]: "Preparado",
};
