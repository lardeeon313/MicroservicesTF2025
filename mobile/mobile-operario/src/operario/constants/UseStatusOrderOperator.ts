//import { OrderStatus } from "../../otherTypes/OrderType"
import { DepotOrderStatus } from "../types/OrderDTO";

export const OrderStatusLabels: Record<DepotOrderStatus, string> = {
  [DepotOrderStatus.Received]: "Recibido",
  [DepotOrderStatus.ReReceived]: "Modificado por faltantes",
  [DepotOrderStatus.Assigned]: "Asignado",
  [DepotOrderStatus.InPreparation]: "En preparación",
  [DepotOrderStatus.MissingProduct]: "Falta producto",
  [DepotOrderStatus.SentToBilling]: "Enviado a facturar",
  [DepotOrderStatus.PendingResolution]: "Pendiente de resolución",
  [DepotOrderStatus.Prepared]: "Preparado",
};
