//service para obtener todos los pedidos que todavia no han sido entregados por parte
//de un operario de logistica 
//se comunica con el service: getmypendingdeliveredorderss

import API from "../../services/axios";
import { LogisticOrder } from "../types/DeliveryOrderTypeDto";

export const getMyPendingDeliveredOrders = async (operatorId: string): Promise<LogisticOrder[]> => {
  try {
    const response = await API.get<LogisticOrder[]>(`/logistic/DeliveryOperator/get-my-pending-delivered-orders/${operatorId}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error("No se encontraron pedidos pendientes de entrega para este operador.");
      } else if (error.response.status === 400) {
        throw new Error("Solicitud inválida. Verifica el ID del operador.");
      }
    }
    throw new Error("Error al obtener los pedidos pendientes de entrega. Intenta nuevamente más tarde.");
  }
};