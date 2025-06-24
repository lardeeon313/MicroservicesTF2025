//Consulta al backend 
import { api } from "../../services/api"
import { OperatorDTO } from "../types/OrderDTO"
import type { RegisterRequest,LoginRequest,AuthResponse } from "../types/AuthTypes";

export const GetOperatorById = async(id:string): Promise<OperatorDTO> => {
    try{
        const response = await api.get('/depotoperator/get-operator-by-id', {
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

export const register = async (data: RegisterRequest): Promise<void> => {
    const response = await api.post('/auth/register', data);
    return response.data;
}

export const login = async (data:LoginRequest) : Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
}