//4: service para cambiar el estado del pedido a entregado: 
import API from "../../services/axios";

export const PostMarkOrderDelivered = async (logisticOrderId: number): Promise<void> => {
  try {
    const response = await API.post(
      `/logistic/DeliveryOperator/mark-delivered?logisticOrderId=${logisticOrderId}`
    );
    console.log("📦 Orden marcada como 'Entregada' exitosamente:", response.data);
  } catch (error: any) {
    console.error(
      "❌ Error al marcar la orden como 'Entregada':",
      error.response?.data || error.message
    );
    throw error;
  }
};