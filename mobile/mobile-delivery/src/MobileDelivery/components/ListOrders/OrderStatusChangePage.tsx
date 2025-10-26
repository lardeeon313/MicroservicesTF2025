import React from "react";
import { View, StyleSheet } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { DeliveryStackParamList } from "../../types/DeliveryStackType";
import OrderStatusChange from "./OrderStatusChange";
import { LogisticOrder } from "../../types/DeliveryOrderTypeDto";

type RouteProps = RouteProp<DeliveryStackParamList, "OrderStatusChange">;

export default function OrderStatusChangePage() {
  const route = useRoute<RouteProps>();
  const { order } = route.params;

  const handleStatusUpdate = (updatedOrder: LogisticOrder) => {
    console.log("Estado actualizado:", updatedOrder.status);
  };

  return (
    <View style={styles.container}>
      <OrderStatusChange order={order} onStatusUpdate={handleStatusUpdate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
});
