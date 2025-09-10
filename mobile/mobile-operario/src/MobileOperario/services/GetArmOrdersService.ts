//trae a todos los pedidos con el estado de Prepared =preparado que es lo mismo que 
//decir armado
import API from "../../services/axios";
import type { DepotOrderDTO } from "../types/OrderDTO";
import { DepotOrderStatus } from "../types/OrderDTO";

export const GetArmOrdersService = async(operatorUserId:string) : Promise<DepotOrderDTO[]> => {
    try{
        //trae todos los pedidos ya asignados:
        const response = await API.get('depot/depotoperator/get-orders-to-operator', 
            {
                params:{
                    operatorUserId : operatorUserId,
                }
            }
        );
        const AllOrders : DepotOrderDTO[] = response.data; 

        //filtra 
        /*return AllOrders.filter(order => {
            order.status === DepotOrderStatus.InPreparation
        })*/
       return AllOrders;

    }catch(error){
        console.error("Momentanamente, no se pudo obtener los pedidos ",error)
        return [];
    }
}