import { api } from "../../services/axios";
import { OrderStatus, type Order } from "../../otherTypes/OrderType";
import type { DepotOrderDTO } from "../types/OrderDTO";

export const GetConfirmedOrdersService = async (): Promise<DepotOrderDTO[]> => {
  try {
    const response = await api.get('/depotoperator/assigned-pending-orders');
    const allOrders: DepotOrderDTO[] = response.data;
    
    return allOrders;

  } catch (error) {
    console.error("Lo sentimos. No se pudo obtener los pedidos:", error);
    return [];
  }
}

