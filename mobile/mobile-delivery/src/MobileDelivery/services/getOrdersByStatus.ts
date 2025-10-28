//7: Dependiendo del estado del pedido , este service devolvera dichos pedidos: 
import API from "../../services/axios";
import { LogisticOrder } from "../types/DeliveryOrderTypeDto";

export const getOrdersByStatus = async (status: string): Promise<LogisticOrder[]> => {
  try {
    const response = await API.get(
      `/logistic/DeliveryOperator/get-orders-by-status/${status}`
    );
    console.log(`✅ Órdenes obtenidas con estado: ${status}`, response.data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
