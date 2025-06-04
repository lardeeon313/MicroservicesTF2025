//services para traer un solo pedido , en caso de querer ver un detalle o emitir un faltante: 
import { api } from "../../services/api";
import type { Order } from "../../otherTypes/OrderType";

//Ejemplo de la api:

export const GetOrderById = async (orderId:number) : Promise<Order> => {
    try{
        const response = await api.get<Order>(`/orders/${orderId}`);
        return response.data;
    } catch(error){
        console.error(`Momentaneamente , no se puede obtener el pedido ${orderId} `,error)
        throw error;
    }
};



