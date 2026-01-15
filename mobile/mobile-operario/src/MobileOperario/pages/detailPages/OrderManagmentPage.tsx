import { useState, useEffect } from "react";
import { DepotOrderStatus, type DepotOrderDTO } from "../../types/OrderDTO";
import { actualizarEstadoPedido } from "../../hocks/actions/updateStatusOrder";
import { OrderStatusMap } from "../../types/OrderDTO";
import { ConfirmedOrder } from "../../services/SetOrderToBilled";
import { handleRejectOrderWithReason } from "../../components/additional/AlertWindows/RejectOrderWithReason";

const ListOfConfirmedOrders: number[] = [101, 102, 103];

export function useOrderManagment(
  initialOrder: DepotOrderDTO,
  operatorID: string,
  setShowSuccessModal?: (value: boolean) => void
) {
  const [order, setOrder] = useState<DepotOrderDTO>(initialOrder);
  const [showMeRejectModal, setShowMeRejectModal] = useState(false);

  useEffect(() => {
    const isConfirmed = ListOfConfirmedOrders.includes(order.depotOrderId);
    if (isConfirmed && order.status === DepotOrderStatus.Assigned) {
      setOrder({ ...order, status: DepotOrderStatus.InPreparation });
    }
  }, [order]);

  const acceptOrder = async () => {
    const UpdateStatus = OrderStatusMap[DepotOrderStatus.InPreparation];
    const UpdatedOrder = { ...order, status: UpdateStatus };

    setOrder(UpdatedOrder);

    await actualizarEstadoPedido(UpdatedOrder, "aceptado");
    await ConfirmedOrder(UpdatedOrder.depotOrderId, operatorID);

    setShowSuccessModal?.(true);
  };

  const rejectOrder = () => {
    setShowMeRejectModal(true);
  };

  const ConfirmRejectWithReason = async (reason: string): Promise<boolean> => {
    return await handleRejectOrderWithReason(
      order,
      operatorID,
      reason,
      setOrder,
      setShowMeRejectModal
    );
  };

  return {
    order,
    acceptOrder,
    rejectOrder,
    showMeRejectModal,
    setShowMeRejectModal,
    ConfirmRejectWithReason,
  };
}
