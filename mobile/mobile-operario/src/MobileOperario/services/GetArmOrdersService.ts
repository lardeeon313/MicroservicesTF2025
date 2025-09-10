import API from "../../services/axios";
import type { DepotOrderDTO } from "../types/OrderDTO";


export const GetArmOrdersService = async(operatorUserId:string) : Promise<DepotOrderDTO[]> => {
    try{

        const response = await API.get('depot/depotoperator/get-orders-to-operator', 
            {
                params:{
                    operatorUserId : operatorUserId,
                }
            }
        );
        const AllOrders : DepotOrderDTO[] = response.data; 

       return AllOrders;

    }catch(error){
        console.error("Momentanamente, no se pudo obtener los pedidos ",error)
        return [];
    }
}