import API from "../../services/axios";
import { ConfirmAssignedOrderRequest } from "../types/Request";

export const PostConfirmAssignedOrder = async (
  request: ConfirmAssignedOrderRequest
): Promise<void> => {
  try {
    const response = await API.post(
      "/logistic/DeliveryOperator/confirm-assign",
      request
    );

    console.log("Respuesta del servidor al confirmar:", response.data);
  } catch (error: any) {
    console.error("Error al confirmar pedido asignado:", error);
    throw error;
  }
};
