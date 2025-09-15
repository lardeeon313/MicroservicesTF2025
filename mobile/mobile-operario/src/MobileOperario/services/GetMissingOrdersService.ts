
import API from "../../services/axios";
import type { DepotOrderDTO } from "../types/OrderDTO";

import type { ReportOrderMissingRequest } from "../types/Missing";




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
        console.error("Momentanamente, no se pudo obtener los pedidos con faltantes",error);
        return[];
    }
}



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