<<<<<<< HEAD
=======
//import API from "../../services/axios";
import { LogisticOrder } from "../types/DeliveryOrderTypeDto";
import API from "../../services/axios";

export const getMyOrdersWithIncident = async (operatorId: string): Promise<LogisticOrder[]> => {
  try {
    const response = await API.get<LogisticOrder[]>(
      `/logistic/DeliveryOperator/get-my-orders-with-incident/${operatorId}`
    );

    console.log("Pedidos con incidentes:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      switch (error.response.status) {
        case 404:
          throw new Error("No se encontraron órdenes con incidencias para este operador.");
        case 400:
          throw new Error("Solicitud inválida. Verifica el ID del operador.");
        default:
          throw new Error("Error desconocido al obtener las órdenes con incidencias.");
      }
    }
    throw new Error("Error de conexión con el servidor. Intenta nuevamente más tarde.");
  }
};

>>>>>>> aa9e73b (Desarrollo del mobile-delivery: implementación del código de Docker para que funcione con los demás microservicios, implementación de todos los endpoints del backend del mobile-delivery, cambios realizados en los Command Handler y en el código de Infrastructure de LogisticOrderRepository (había muchos filtros que impedían incluso traer pedidos))
