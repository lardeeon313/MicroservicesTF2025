//trae a todos los pedidos con el estado de Prepared =preparado que es lo mismo que 
//decir armado
import { api } from "../../services/api";
import { OrderStatus, type Order } from "../../otherTypes/OrderType";

export const GetArmOrdersService = async() : Promise<Order[]> => {
    try{
        const response = await api.get('/orders');
        const AllOrders : Order[] = response.data; 

        //filtra 
        return AllOrders.filter(order => {
            order.status === OrderStatus.Prepared
        })

    }catch(error){
        console.error("Momentanamente, no se pudo obtener los pedidos ",error)
        return [];
    }
}