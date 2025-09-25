import { useState } from "react";
import { Alert } from "react-native";
import { DeliveryOrderTypeDto } from "../types/DeliveryOrderTypeDto";

export function useValidationOrdersLogic(
  orders: DeliveryOrderTypeDto[],
  onConfirmRoute?: () => void
) {
  const [selectedOrders, setSelectedOrders] = useState<DeliveryOrderTypeDto[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Seleccionar/deseleccionar pedidos
  const toggleSelectOrder = (order: DeliveryOrderTypeDto) => {
    setSelectedOrders((prev) =>
      prev.find((o) => o.id === order.id)
        ? prev.filter((o) => o.id !== order.id)
        : [...prev, order]
    );
  };

  // Validar pedidos de prioridad HIGH
  const handleTraceRoute = () => {
      const highConfirmedOrders = selectedOrders.filter(
    (order) => order.priority === "HIGH" && order.status === "CONFIRM"
  );

  const highOrders = orders.filter((o) => o.priority === "HIGH" && o.status === "TO_DISTRIBUTE");
  const highNotSelected = highOrders.filter(
    (high) => !selectedOrders.find((sel) => sel.id === high.id && sel.status === "CONFIRM")
  );

  if (highNotSelected.length > 0) {
    Alert.alert(
      "🚨 Pedido prioritario pendiente",
      `Hay ${highNotSelected.length} pedidos de prioridad ALTA sin incluir en la ruta.\n¿Deseas avanzar igualmente?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Avanzar", style: "destructive", onPress: () => setShowModal(true) },
      ]
    );
    return;
  }

  if (highConfirmedOrders.length > 0) {
    setShowModal(true);
    if (onConfirmRoute) onConfirmRoute();
  } else {
    Alert.alert("Error", "No hay pedidos de prioridad ALTA confirmados para trazar la ruta.");
  }
    };

  return {
    selectedOrders,
    showModal,
    setShowModal,
    toggleSelectOrder,
    handleTraceRoute,
  };
}
