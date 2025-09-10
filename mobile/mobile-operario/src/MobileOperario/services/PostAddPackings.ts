 
import API from "../../services/axios";
import { AddPackingCommand } from "../types/AddPackings";
import { MarkItemCommand } from "../types/AddPackings";
import { UnMarkItemReadyCommand } from "../types/AddPackings";

export const AddPackanings = async (data: AddPackingCommand) => {
    try{
        console.log("Payload enviado al backend:",data);
        const response = await API.post('depot/depotoperator/add-packagings',data)
        console.log("Respuesta del backend:");
        console.log(response.data);
        return response.data;
    }catch(error:any){
        console.log("Error de Axios:", error.response?.data || error.message);
        throw error;
    }
}

 
export const MarkItemIsReady = async (data: MarkItemCommand) => {
    try{
        const response = await API.post('depot/depotoperator/mark-item-is-ready',data);
        return response.data;
    }catch(error){
        throw error;
    }
};

 
export const UnMarkItemIsReady = async (data: UnMarkItemReadyCommand) => {
    try{
        const response = await API.post('depot/depotoperator/unmark-item-ready',data);
        return response.data;
    }catch (error){
        throw error;
    }
}