//trea a todos los pedidos que se encuentran en estado de preparacion: suponiendo que al momento 
//de preparalos se encontro faltantes 

import { api } from "../../services/api";
import type { DepotOrderDTO } from "../types/OrderDTO";
import { DepotOrderStatus } from "../types/OrderDTO";
import { DepotOrderMissingDto } from "../types/Missing";
//service para traer los pedidos asignados por parte de un operario para lo que es faltantes 
export const GetMissingOrdersService = async() : Promise<DepotOrderDTO[]> => {
    try{
        const response = await api.get('/depotoperator/get-orders-to-operator');
        const AllOrders : DepotOrderDTO[] = response.data;

        //filtra los pedidos en base a su estado: 
        return AllOrders.filter(order => {
            order.status === DepotOrderStatus.InPreparation 
        })

    }catch(error){
        console.error("Momentanamente, no se pudo obtener los pedidos ",error);
        return[];
    }
}


//service para comunicarse con el endpoint de report-Order-Missing
export const reportOrderMissing = async (data: DepotOrderMissingDto) => {
    try{
        const response = await api.post('/depotoperator/report-order-missing', data);
        return response.data;
    }
    catch(error){
        throw error;
    }
}