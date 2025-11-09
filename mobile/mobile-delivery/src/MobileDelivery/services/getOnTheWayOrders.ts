//endpoint para obtener todos los pedidos en camino, con el status OnTheWay 
//Ultimo: es decir para obtener los pedidos con status = OnTheWay
import API from "../../services/axios";
import { LogisticOrder } from "../types/DeliveryOrderTypeDto";

// ✅ Endpoint para obtener todos los pedidos en camino (status = OnTheWay)
export const getMyOnTheWayOrders = async (operatorId: string): Promise<LogisticOrder[]> => {
  try {
    const response = await API.get<LogisticOrder[]>(`/logistic/DeliveryOperator/get-my-on-the-way-orders/${operatorId}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Si es 404 (no hay pedidos), devolvemos lista vacía en lugar de lanzar un error
      if (error.response.status === 404) {
        return [];
      }

      // Si es 400 (ID inválido), también podemos devolver vacío o manejarlo distinto
      if (error.response.status === 400) {
        console.warn("Solicitud inválida. Verifica el ID del operador.");
        return [];
      }
    }

    return [];
  }
};
