import API from "../../services/axios";
import { LogisticOrder } from "../types/DeliveryOrderTypeDto";

export const getMyRejectOrders = async (operatorId: string): Promise<LogisticOrder[]> => {
  try {
    console.log("📡 Solicitando órdenes rechazadas del operador:", operatorId);

    const response = await API.get<LogisticOrder[]>(
      `/logistic/DeliveryOperator/get-my-reject-orders/${operatorId}`
    );

    console.log("✅ Órdenes rechazadas recibidas:", response.data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};