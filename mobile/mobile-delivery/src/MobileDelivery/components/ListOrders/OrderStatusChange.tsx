import React from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DeliveryStackParamList } from "../../types/DeliveryStackType";
import { LogisticOrder, OrderStatus } from "../../types/DeliveryOrderTypeDto";

type NavProps = NativeStackNavigationProp<DeliveryStackParamList>;

interface Props {
  order: LogisticOrder;
  onStatusUpdate: (updatedOrder: LogisticOrder) => void;
}

export default function OrderStatusChange({ order, onStatusUpdate }: Props) {
  const navigation = useNavigation<NavProps>();

  const handleMarkInPreparation = () => {
    const updated = { ...order, status: OrderStatus.InPreparation };
    onStatusUpdate(updated);
    Alert.alert("En preparación", `Pedido #${order.id} está en preparación.`);
  };

  const handleMarkOnTheWay = () => {
    const updated = { ...order, status: OrderStatus.OnTheWay };
    onStatusUpdate(updated);

    Alert.alert("Pedido en camino", `Pedido #${order.id} marcado como En Camino.`);

    // Recuperar todos los pedidos desde navigation (globalState simulado)
    navigation.navigate("OrdersToDistribute"); // Volver a lista
  };

  return (
    <View style={styles.container}>
      <Text style={styles.statusLabel}>
        Estado actual: <Text style={styles.statusValue}>{order.status}</Text>
      </Text>

      {order.status === OrderStatus.Confirmed && (
        <TouchableOpacity
          style={[styles.button, styles.preparationButton]}
          onPress={handleMarkInPreparation}
        >
          <Text style={styles.buttonText}>Marcar En Preparación</Text>
        </TouchableOpacity>
      )}

      {order.status === OrderStatus.InPreparation && (
        <TouchableOpacity
          style={[styles.button, styles.onTheWayButton]}
          onPress={handleMarkOnTheWay}
        >
          <Text style={styles.buttonText}>Marcar En Camino</Text>
        </TouchableOpacity>
      )}

      {order.status === OrderStatus.OnTheWay && (
        <Text style={styles.infoText}>✅ Este pedido ya está En Camino.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff", borderRadius: 12 },
  statusLabel: { fontSize: 18, marginBottom: 10 },
  statusValue: { fontWeight: "bold", color: "#007bff" },
  button: { padding: 10, borderRadius: 8, marginTop: 8 },
  preparationButton: { backgroundColor: "#f59e0b" },
  onTheWayButton: { backgroundColor: "#4a9c13" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  infoText: { marginTop: 10, fontSize: 16, color: "gray" },
});
