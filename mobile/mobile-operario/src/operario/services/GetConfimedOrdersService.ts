import { api } from "../../services/api";
import { OrderStatus, type Order } from "../../otherTypes/OrderType";
import type { DepotOrderDTO } from "../types/OrderDTO";

export const GetConfirmedOrdersService = async (): Promise<DepotOrderDTO[]> => {
  try {
    const response = await api.get('/depotoperator/assigned-pending-orders');
    const allOrders: DepotOrderDTO[] = response.data;

    // Filtrar pedidos con estado Pending o Confirmed
    /*return allOrders.filter(order =>
      order.status === OrderStatus.Pending || order.status === OrderStatus.Confirmed
    );*/
    return allOrders;

  } catch (error) {
    console.error("Lo sentimos. No se pudo obtener los pedidos:", error);
    return [];
  }
}

