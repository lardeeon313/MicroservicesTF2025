//trea a todos los pedidos que se encuentran en estado de preparacion: suponiendo que al momento 
//de preparalos se encontro faltantes 
import type { DepotOrderDTO } from "../types/OrderDTO";
import { DepotOrderStatus } from "../types/OrderDTO";
import type { ReportOrderMissingRequest } from "../types/Missing";
import API from "../../services/axios";



//service para traer los pedidos asignados por parte de un operario para lo que es faltantes 
export const GetMissingOrdersService = async(operatorUserId:string) : Promise<DepotOrderDTO[]> => {
    try{
        const response = await API.get('depot/depotoperator/get-missing-orders-to-operator',
            {
                params:{
                    operatorUserId: operatorUserId,
                }
            }
        );
        const AllOrders : DepotOrderDTO[] = response.data;
        return AllOrders;

    }catch(error){
        console.error("Momentanamente, no se pudo obtener los pedidos ",error);
        return[];
    }
}


//service para comunicarse con el endpoint de report-Order-Missing
export const reportOrderMissing = async (data: ReportOrderMissingRequest) => {
    try{
        const response = await API.post('depot/depotoperator/report-order-missing', data);
        return response.data;
    }
    catch(error){
        console.log("❌❌ Error real del backend:", error);
        throw error;
    }
}