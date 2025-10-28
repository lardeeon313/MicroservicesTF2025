// 8: endpoint para obtener un solo pedido: 
import API from "../../services/axios";
import { LogisticOrder } from "../types/DeliveryOrderTypeDto";

export const getOrderById = async (orderId: number): Promise<LogisticOrder> => {
  
  // --- CONSOLE LOG AGREGADO ---
  // Log para verificar qué ID estamos recibiendo *exactamente*
  console.log(`[getOrderById] Iniciando solicitud para ID: ${orderId}`);
  // -----------------------------

  try {
    const response = await API.get<LogisticOrder>(`/logistic/DeliveryOperator/get-order-by-id/${orderId}`);
    
    // --- CONSOLE LOG AGREGADO ---
    // Log para ver la respuesta exitosa del backend
    console.log("[getOrderById] Respuesta exitosa:", response.data);
    // -----------------------------
    
    return response.data;
  } catch (error: any) {
    
    // --- CONSOLE LOG AGREGADO ---
    // Logueamos el objeto de error completo para más detalles
    console.error("[getOrderById] Error completo:", JSON.stringify(error, null, 2));
    // -----------------------------

    if (error.response) {
      // --- CONSOLE LOG AGREGADO ---
      // Log específico para errores con respuesta del servidor
      console.error(`[getOrderById] Error del servidor: Status ${error.response.status}`, error.response.data);
      // -----------------------------
      
      if (error.response.status === 404) {
        throw new Error("La orden no fue encontrada.");
      } else if (error.response.status === 400) {
        throw new Error("Solicitud inválida. Verifica el ID proporcionado.");
      }
    } else if (error.request) {
      // --- CONSOLE LOG AGREGADO ---
      console.error("[getOrderById] No se recibió respuesta:", error.request);
      // -----------------------------
    } else {
      // --- CONSOLE LOG AGREGADO ---
      console.error("[getOrderById] Error de configuración:", error.message);
      // -----------------------------
    }
    throw new Error("Error al obtener la orden. Intenta nuevamente más tarde.");
  }
};