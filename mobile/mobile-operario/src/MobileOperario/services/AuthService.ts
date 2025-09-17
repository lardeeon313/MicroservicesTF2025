

import API from "../../services/axios";
import { OperatorDTO } from "../types/OrderDTO"


export const GetOperatorById = async(id:string): Promise<OperatorDTO> => {
    try{
        const response = await API.get('/depot/depotoperator/get-operator-by-id', {
            params: {id}
        });

        const data = response.data; 
        return{
            id:data.id,
            depotTeamId:data.depotTeamId,
            roleInTeam: data.roleInTeam || 'Operator',
            assignedAt: data.assignedAt
        }
    }catch(error){
        throw new Error("Operador no encontrado para el pedido asignado");
    }
}
