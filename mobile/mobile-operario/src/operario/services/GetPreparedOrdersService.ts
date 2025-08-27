//Service que se comunica con el endpoint el cual recibe todos los pedidos que tenga 
//estatus de Prepared y SentToBilling 

import { api } from "../../services/axios";
import { DepotOrderDTO } from "../types/OrderDTO";

export const GetPreparedOrdersService = async(operatorUserId: string): Promise<DepotOrderDTO[]> => {
    try {
        const response = await api.get('/depotoperator/get-prepared-sentToBilling-orders-to-operator', {
            params: {
                operatorUserId: operatorUserId,
            }
        });

        const allOrders: DepotOrderDTO[] = response.data;
        console.log("✅ Pedidos recibidos desde el backend:", allOrders);
        return allOrders;
    } catch (error) {
        console.error("❌ Momentaneamente no se pueden obtener los pedidos", error);
        return [];
    }
}
