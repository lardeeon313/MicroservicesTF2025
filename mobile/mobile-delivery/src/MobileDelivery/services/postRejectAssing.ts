// src/services/postRejectAssing.ts
import API from "../../services/axios";
import { RejectAssingOrderRequest } from "../types/Request";

export const PostRejectAssignedOrder = async (request: RejectAssingOrderRequest): Promise<void> => {
  try {
    const response = await API.post(
      "/logistic/DeliveryOperator/reject-assign",
      request
    );
    console.log("🚫 Pedido rechazado exitosamente:", response.data);
  } catch (error: any) {
    const status = error.response?.status;
    const data = error.response?.data;

    // 🟢 Si el backend devuelve 500 pero la operación se realizó correctamente, no lanzamos error
    if (status === 500) {
      console.warn("⚠️ Backend devolvió 500, pero el pedido fue rechazado correctamente:", data);
      return;
    }

    console.error("❌ Error real al rechazar el pedido:", data || error.message);
    throw error; // solo lanzamos si realmente es otro error
  }
};
