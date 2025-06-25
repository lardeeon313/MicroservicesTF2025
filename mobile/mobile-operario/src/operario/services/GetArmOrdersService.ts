//trae a todos los pedidos con el estado de Prepared =preparado que es lo mismo que 
//decir armado
import { api } from "../../services/api";
import type { DepotOrderDTO } from "../types/OrderDTO";
import { DepotOrderStatus } from "../types/OrderDTO";

export const GetArmOrdersService = async() : Promise<DepotOrderDTO[]> => {
    try{
        //trae todos los pedidos ya asignados:
        const response = await api.get('/depotoperator/get-orders-to-operator');
        const AllOrders : DepotOrderDTO[] = response.data; 

        //filtra 
        return AllOrders.filter(order => {
            order.status === DepotOrderStatus.InPreparation
        })

    }catch(error){
        console.error("Momentanamente, no se pudo obtener los pedidos ",error)
        return [];
    }
}