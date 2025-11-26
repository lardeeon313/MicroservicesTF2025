import { useState,useEffect } from "react";
import { DepotOrderStatus, type DepotOrderDTO } from "../../types/OrderDTO";

import { actualizarEstadoPedido } from "../../hocks/actions/updateStatusOrder";
import { showmeAcceptOrderAlert,showmeRejectOrderAlert } from "../../components/additional/AlertWindows/AlertManager";
import { OrderStatusMap } from "../../types/OrderDTO";
import { ConfirmedOrder } from "../../services/SetOrderToBilled";
import { handleRejectOrderWithReason } from "../../components/additional/AlertWindows/RejectOrderWithReason";

const ListOfConfirmedOrders: number[] = [101, 102, 103];

export function useOrderManagment(initialOrder: DepotOrderDTO, operatorID:string,navigation: any) {
    const [order,setOrder] = useState<DepotOrderDTO>(initialOrder);
    const [showMeRejectModal,setShowMeRejectModal] = useState(false);

    useEffect(() => {
        const isConfirmed = ListOfConfirmedOrders.includes(order.depotOrderId);
        if(isConfirmed && order.status === DepotOrderStatus.Assigned){
            setOrder({...order,status : DepotOrderStatus.InPreparation});
        }
    }, [order]); 

    const acceptOrder = () => {
            showmeAcceptOrderAlert(async() => {
        try {
            const UpdateStatus = OrderStatusMap[DepotOrderStatus.InPreparation];
            const UpdatedOrder = {...order, status: UpdateStatus};

            console.log("Pedido ACEPTADO desde front:", {
                depotOrderId: order.depotOrderId,
                operatorID,
                nuevoEstado: UpdateStatus
            });

            setOrder(UpdatedOrder);

            
            await actualizarEstadoPedido(UpdatedOrder, "aceptado");

           
            const response = await ConfirmedOrder(UpdatedOrder.depotOrderId, operatorID);

            console.log("Respuesta que se obtuvo del backend: ", response);

            navigation.navigate("OperatorDashboard");
        } catch(error) {
            throw error;
        };
    })
    }


    const rejectOrder = ()=> {
        setShowMeRejectModal(true);
    }

    const ConfirmRejectWithReason = (reason:string) => {
        handleRejectOrderWithReason(order, operatorID,reason,setOrder,setShowMeRejectModal)
    }

    return{
        order,
        //setOrder,
        acceptOrder,
        rejectOrder,
        showMeRejectModal,
        setShowMeRejectModal,
        ConfirmRejectWithReason
    };
}