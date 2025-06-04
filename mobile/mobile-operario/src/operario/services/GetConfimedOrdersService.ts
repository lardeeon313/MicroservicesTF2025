//trar todos los pedidos si tienen el estado de pending o confirmed 
import { api } from "../../services/api";
import { OrderStatus, type Order } from "../../otherTypes/OrderType";

export const GetConfirmedOrdersService = async () : Promise<Order[]> => {
    try{
        const response = await api.get('/orders');
        //trae a todos los pedidos en base a la respuesta de la api: 
        const allOrders : Order[] = response.data;

        //Filtra 
        return allOrders.filter(order => {
            order.status === OrderStatus.Pending || order.status === OrderStatus.Confirmed
        })
    }catch(error){
        console.error("Momentanamente, no se pudo obtener los pedidos ",error);
        return[];
    }
}