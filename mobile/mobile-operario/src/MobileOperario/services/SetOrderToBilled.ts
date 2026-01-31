import API from "../../services/axios";


export const SetOrderToBilled = async(orderID: number) => { 
    const response = await API.post('depot/depotoperator/sent-to-billing',{
        depotorderId:orderID,
    });
    return response.data;
}


export const ConfirmedOrder = async (DepotOrderId: number, OperatorUserId: string) => {
    try {
        const response = await API.post('depot/depotoperator/confirm-assign', {
            DepotOrderId,
            OperatorUserId
        });
        
        
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
            RejectionReason: RejectReason,
        });
        console.log("Respuesta del backend:", response.data);
        console.log("=== RejectOrder - response completa ===", JSON.stringify(response, null, 2));
        console.log("=== RejectOrder - response.data ===", response.data);
        return response.data;
    }catch(error){
        console.error("=== RejectOrder - ERROR ===", error);
        throw error;
    }
}