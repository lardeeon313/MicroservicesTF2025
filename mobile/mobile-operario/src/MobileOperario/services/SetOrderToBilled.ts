import API from "../../services/axios";


export const SetOrderToBilled = async(orderID: number) => {
    //se comunica con el endpoint para enviar el pedido a facturar 
    const response = await API.post('depot/depotoperator/sent-to-billing',{
        depotorderId:orderID,
    });
    return response.data;
}

//demas services que hacen falta: tiene que recibir tanto el opeator como el order
export const ConfirmedOrder = async (DepotOrderId: number, OperatorUserId: string) => {
    try {
        const response = await API.post('depot/depotoperator/confirm-assign', {
            DepotOrderId,
            OperatorUserId
        });
        //DEPURACION: 
        
        return response.data;
    } catch (error) {
        
        throw error;
    }
};

export const RejectOrder = async (DepotOrderId: number, OperatorUserId: string,RejectReason: string) => {

    //depuracion:
    console.log("Llamando al endpoint de rechazo:", {
        RejectReason,
    });

    try{
        const response = await API.post('depot/depotoperator/reject-order', {
            DepotOrderId,
            OperatorUserId,
            RejectReason,
        });
        console.log("Respuesta del backend:", response.data);
        return response.data;
    }catch(error){
        throw error;
    }
}