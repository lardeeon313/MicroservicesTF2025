//service que se comunica con el endpoint para agregar empaques a un pedido del deposito
//por parte del operator 
import { api } from "../../services/axios";
import { AddPackingCommand } from "../types/AddPackings";
import { MarkItemCommand } from "../types/AddPackings";
import { UnMarkItemReadyCommand } from "../types/AddPackings";

export const AddPackanings = async (data: AddPackingCommand) => {
    try{
        console.log("Payload enviado al backend:",data);
        const response = await api.post('/depotoperator/add-packagings',data)
        console.log("Respuesta del backend:");
        console.log(response.data);
        return response.data;
    }catch(error:any){
        console.log("Error de Axios:", error.response?.data || error.message);
        throw error;
    }
}

//service que se comunica con el endpoint para marcar un item dentro del pedido: 
export const MarkItemIsReady = async (data: MarkItemCommand) => {
    try{
        const response = await api.post('/depotoperator/mark-item-is-ready',data);
        return response.data;
    }catch(error){
        throw error;
    }
};

//service que se comunica con el endpoint para desmarcar un item dentro del pedido: 
export const UnMarkItemIsReady = async (data: UnMarkItemReadyCommand) => {
    try{
        const response = await api.post('/depotoperator/unmark-item-ready',data);
        return response.data;
    }catch (error){
        throw error;
    }
}