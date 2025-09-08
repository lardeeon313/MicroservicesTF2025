//service que se comunica con el endpoint para agregar empaques a un pedido del deposito
//por parte del operator 
import API from "../../services/axios";
import { AddPackagingRequest, AddPackagingCommand } from "../types/AddPackings";
import { MarkItemCommand } from "../types/AddPackings";
import { UnMarkItemReadyCommand } from "../types/AddPackings";

export const AddPackaging = async (data: AddPackagingRequest) => {
    try{
        // Crear el comando según el backend
        const command: AddPackagingCommand = {
            packagingItems: [data]
        };
        
        console.log("Payload enviado al backend:", command);
        const response = await API.post('/depot/depotoperator/add-packaging', command);
        console.log("Respuesta del backend:", response.data);
        return response.data;
    }catch(error: any){
        console.log("Error de Axios:", error.response?.data || error.message);
        throw error;
    }
}

//service que se comunica con el endpoint para marcar un item dentro del pedido: 
export const MarkItemIsReady = async (data: MarkItemCommand) => {
    try{
        const response = await API.post('/depot/depotoperator/mark-item-is-ready',data);
        return response.data;
    }catch(error){
        throw error;
    }
};

//service que se comunica con el endpoint para desmarcar un item dentro del pedido: 
export const UnMarkItemIsReady = async (data: UnMarkItemReadyCommand) => {
    try{
        const response = await API.post('/depot/depotoperator/unmark-item-ready',data);
        return response.data;
    }catch (error){
        throw error;
    }
}