//endpoint para obtener todos los pedidos en camino, con el status OnTheWay 
//Ultimo: es decir para obtener los pedidos con status = OnTheWay
import API from "../../services/axios";
import { LogisticOrder } from "../types/DeliveryOrderTypeDto";

export const getMyOnTheWayOrders = async (operatorId: string): Promise<LogisticOrder[]> => {
  try {
    const response = await API.get<LogisticOrder[]>(`/logistic/DeliveryOperator/get-my-on-the-way-orders/${operatorId}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error("No se encontraron pedidos en camino para este operador.");
      } else if (error.response.status === 400) {
        throw new Error("Solicitud inválida. Verifica el ID del operador.");
      }
    }
    throw new Error("Error al obtener los pedidos en camino. Intenta nuevamente más tarde.");
  }
};