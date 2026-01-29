//Service para obtener todos los pedidos los cuales ya han sido entregados pero todavia no han 
//sido rendidos , o pagados , dependiendo del tipo de pago: 
//se comunica con el endpoint get-my-pending-cash-orders; 
import API from "../../services/axios";
import { LogisticOrder } from "../types/DeliveryOrderTypeDto";

export const getMyPendingCashOrders = async (operatorId: string): Promise<LogisticOrder[]> => {
  try {
    const response = await API.get<LogisticOrder[]>(`/logistic/DeliveryOperator/get-my-pending-cash-orders/${operatorId}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error("No se encontraron pedidos pendientes de pago en efectivo para este operador.");
      } else if (error.response.status === 400) {
        throw new Error("Solicitud inválida. Verifica el ID del operador.");
      }
    }
    throw new Error("Error al obtener los pedidos pendientes de pago. Intenta nuevamente más tarde.");
  }
};