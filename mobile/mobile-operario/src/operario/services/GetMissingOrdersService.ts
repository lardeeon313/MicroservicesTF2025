//trea a todos los pedidos que se encuentran en estado de preparacion: suponiendo que al momento 
//de preparalos se encontro faltantes 

import { api } from "../../services/api";
import { OrderStatus, type Order } from "../../otherTypes/OrderType";

export const GetMissingOrdersService = async() : Promise<Order[]> => {
    try{
        const response = await api.get('/orders');

        const AllOrders : Order[] = response.data;
        //filtra los pedidos en base a su estado: 
        return AllOrders.filter(order => {
            order.status === OrderStatus.InPreparation 
        })

    }catch(error){
        console.error("Momentanamente, no se pudo obtener los pedidos ",error);
        return[];
    }
}
