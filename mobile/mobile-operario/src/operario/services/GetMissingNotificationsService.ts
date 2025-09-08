import API from "../../services/axios";
import type { DepotOrderDTO } from "../types/OrderDTO";


//Service que se comunica con el endpoint de GetOrderByID para mostrar las notificaciones faltantes 
export const GetMissingNotifications = async (orderId: number,userID: string) : Promise<DepotOrderDTO | null> => 
{  
    //sin condicional 
    try {
        const response = await API.get<DepotOrderDTO>('/depot/depotoperator/get-order-by-id', {
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