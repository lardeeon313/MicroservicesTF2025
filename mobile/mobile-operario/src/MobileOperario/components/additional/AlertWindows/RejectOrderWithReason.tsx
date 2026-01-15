import { DepotOrderStatus, type DepotOrderDTO } from "../../../types/OrderDTO";
import { Alert, Modal, Text, TextInput, View, Button, StyleSheet  } from "react-native";
import { RejectOrder } from "../../../services/SetOrderToBilled";
import { actualizarEstadoPedido } from "../../../hocks/actions/updateStatusOrder";

export const handleRejectOrderWithReason = async (
  order: DepotOrderDTO,
  operatorId: string,
  reason: string,
  setOrder: (order: DepotOrderDTO) => void,
  setShowRejectModal: (value: boolean) => void
): Promise<boolean> => {
  try {
    if (!reason.trim()) return false;

    await RejectOrder(order.depotOrderId, operatorId, reason);

    const updatedOrder = {
      ...order,
      status: DepotOrderStatus.Assigned,
    };

    setOrder(updatedOrder);
    await actualizarEstadoPedido(updatedOrder, "rechazado");

    setShowRejectModal(false);
    return true;

  } catch (error) {
    console.error("Error al rechazar el pedido:", error);
    return false;
  }
};
