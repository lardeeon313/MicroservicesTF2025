import API from "../../services/axios";

import type { DepotOrderDTO } from "../types/OrderDTO";

export const GetConfirmedOrdersService = async (): Promise<DepotOrderDTO[]> => {
  try {
    const response = await API.get('depot/depotoperator/assigned-pending-orders');
    const allOrders: DepotOrderDTO[] = response.data;
    
    return allOrders;

  } catch (error) {
    console.error("Lo sentimos. No se pudo obtener los pedidos:", error);
    return [];
  }
}

