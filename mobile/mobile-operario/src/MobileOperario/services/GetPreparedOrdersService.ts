
import API from "../../services/axios";
import { DepotOrderDTO } from "../types/OrderDTO";

export const GetPreparedOrdersService = async(operatorUserId: string): Promise<DepotOrderDTO[]> => {
    try {
        const response = await API.get('depot/depotoperator/get-prepared-sentToBilling-orders-to-operator', {
            params: {
                operatorUserId: operatorUserId,
            }
        });

        const allOrders: DepotOrderDTO[] = response.data;
        console.log("✅ Pedidos recibidos desde el backend con status SentToBilling y Prepared:", allOrders);
        return allOrders;
    } catch (error) {
        
        return [];
    }
}
