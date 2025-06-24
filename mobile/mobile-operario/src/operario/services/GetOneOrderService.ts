//services para traer un solo pedido , en caso de querer ver un detalle o emitir un faltante: 
import { api } from "../../services/api";
//import type { Order } from "../../otherTypes/OrderType";
import type { DepotOrderDTO } from "../types/OrderDTO";
//Ejemplo de la api:
import { DepotTeamAssigment } from "../types/OrderDTO";


export const GetOrderById = async (orderId:number,userId: string) : Promise<DepotOrderDTO> => {
    if (!orderId || !userId) {
        throw new Error("Faltan parámetros: orderId o userId");
    }
    
    try{
        const response = await api.get<DepotOrderDTO>('/depotoperator/get-order-by-id',{
            params: {
                DepotOrderId: orderId,
                OperatorUserId: userId,
            }
        });
        return response.data;
    } catch(error){
        console.error(`No se pudo obtener el pedido ${orderId} para el operador ${userId}`, error)
        throw error;
    }
};

