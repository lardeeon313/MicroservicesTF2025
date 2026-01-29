//se comunica con el endpoint de: 
//get-my-assigned-orders; 

import API, { API_BASE_URL } from "../../services/axios";
import { LogisticOrder } from "../types/DeliveryOrderTypeDto";

export const getMyAssignedOrders = async (operatorId: string): Promise<LogisticOrder[]> => {
  try {
    console.log("📡 Usando API_BASE_URL:", API_BASE_URL);
    console.log("👷 Operator ID recibido:", operatorId);

    const response = await API.get<LogisticOrder[]>(
      `/logistic/DeliveryOperator/get-my-assigned-orders/${operatorId}`
    );

    console.log("📦 Datos recibidos del backend:", response.data);
    return response.data;
  } catch (error: any) {
    

    if (error.response) {
      if (error.response.status === 404) {
        throw new Error("No se encontraron pedidos asignados para este operador.");
      } else if (error.response.status === 400) {
        throw new Error("Solicitud inválida. Verifica el ID del operador.");
      }
    }
    throw new Error("Error al obtener los pedidos asignados. Intenta nuevamente más tarde.");
  }
};
