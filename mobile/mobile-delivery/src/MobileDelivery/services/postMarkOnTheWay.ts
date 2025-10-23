//3: service para cambiar el estado del pedido a ontheway: 

import API from "../../services/axios";
import { MarkOrderOnTheWayRequest } from "../types/Request";

export const PostMarkOrderOnTheWay = async (request: MarkOrderOnTheWayRequest): Promise<void> => {
  try {
    const response = await API.post(
      "/logistic/DeliveryOperator/mark-on-the-way",
      request
    );
    console.log("Orden marcada como 'En camino' exitosamente:", response.data);
  } catch (error: any) {
    console.error("❌ Error al marcar la orden como 'En camino':", error.response?.data || error.message);
    throw error;
  }
};

