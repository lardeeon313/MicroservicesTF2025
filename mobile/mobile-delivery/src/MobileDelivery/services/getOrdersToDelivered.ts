//Con este service , el opedor podra obtener todos los pedidos entregados: 
//se comunica con el endpoint: get-my-delivered-orders; 

import API from "../../services/axios";
import { LogisticOrder } from "../types/DeliveryOrderTypeDto";

export const getMyDeliveredOrders = async (operatorId: string): Promise<LogisticOrder[]> => {
  console.log(`[Service:getMyDeliveredOrders] 🚀 Solicitando pedidos entregados para operador ID: ${operatorId}`);

  try {
    const response = await API.get<LogisticOrder[]>(
      `/logistic/DeliveryOperator/get-my-delivered-orders/${operatorId}`
    );

    console.log("[Service:getMyDeliveredOrders] ✅ Respuesta completa del servidor:", response);
    console.log("[Service:getMyDeliveredOrders] 📦 Data recibida:", response.data);

    return response.data;
  } catch (error: any) {
    console.error("[Service:getMyDeliveredOrders] ❌ Error capturado:", error);

    if (error.response) {
      console.error("[Service:getMyDeliveredOrders] 🔍 Detalles del error de respuesta:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });

      if (error.response.status === 404) {
        throw new Error("No se encontraron pedidos entregados para este operador.");
      } else if (error.response.status === 400) {
        throw new Error("Solicitud inválida. Verifica el ID del operador.");
      } else {
        throw new Error(
          `Error del servidor (${error.response.status}): ${error.response.data?.message || "Error desconocido."}`
        );
      }
    } else if (error.request) {
      console.error("[Service:getMyDeliveredOrders] 🛰️ No se recibió respuesta del servidor:", error.request);
      throw new Error("No se pudo conectar con el servidor. Verifica tu conexión.");
    } else {
      console.error("[Service:getMyDeliveredOrders] ⚙️ Error al configurar la solicitud:", error.message);
      throw new Error("Error al configurar la solicitud de pedidos entregados.");
    }
  }
};
