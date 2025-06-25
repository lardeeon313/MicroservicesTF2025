import { DepotOrderStatus, type DepotOrderDTO } from "../../../types/OrderDTO";
import { Alert, Modal, Text, TextInput, View, Button, StyleSheet  } from "react-native";
import { RejectOrder } from "../../../services/SetOrderToBilled";
import { actualizarEstadoPedido } from "../../../hocks/actions/updateStatusOrder";

export const handleRejectOrderWithReason = async (
    order: DepotOrderDTO,
    operatorId:string,
    reason: string,
    setOrder: (order: DepotOrderDTO) => void,
    setShowRejectModal : (value: boolean) => void, 
) => {
    try {
      if (!reason.trim()) {
        Alert.alert("Motivo requerido", "Por favor ingresá una razón válida.");
        return;
      }
      //depuracion:
      console.log("Enviando rechazo con motivo:", {
        reason
      });

      await RejectOrder(order.depotOrderId, operatorId, reason);
      const updatedOrder = { ...order, status: DepotOrderStatus.Assigned };
      setOrder(updatedOrder);
      await actualizarEstadoPedido(updatedOrder, "rechazado");

    
      // ACA mostras el mensaje luego de un rechazo exitoso:
      Alert.alert(
      "Pedido rechazado",
      "Se rechazó el pedido para ser asignado a otra persona",
          [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error al rechazar el pedido:", error);
      Alert.alert("Error", "No se pudo rechazar el pedido.");
    } finally {
      setShowRejectModal(false);
  }
}