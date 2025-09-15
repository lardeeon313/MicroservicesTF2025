import API from "../../services/axios";
import type { DepotOrderDTO } from "../types/OrderDTO";


export const GetMissingNotifications = async (orderId: number,userID: string) : Promise<DepotOrderDTO | null> => 
{  
     
    try {
        const response = await API.get<DepotOrderDTO>('depot/depotoperator/get-order-by-id', {
            params: { 
                DepotOrderId: orderId,
                OperatorUserId: userID,
            },
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error al obtener el pedido con faltantes:", error);
        return null;
    }
};