import React, { useState, useMemo } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import NavbarDelivery from "../../components/Navbar/NavbarDelivery";
import GetBack from "../../../components/GetBack";
import { mockOrders } from "../../MockPrueba/mockOrders";
import ListOrdersToDistributeComponent from "../../components/ListOrders/ListOrdersToDistribute";
import OrdersCountToDistribute from "../../components/ListOrders/OrdersCountToDistribute";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DeliveryStackParamList } from "../../types/DeliveryStackType";
import { useValidationOrdersLogic } from "../../validations/ValidationOrdersToDistribute";
import { LogisticOrder, OrderStatus } from "../../types/DeliveryOrderTypeDto";
import ConfirmOrderModal from "../../components/ConfirmOrder/ConfirmOrder";
import RejectOrderModal from "../../components/RejectOrder/RejectOrder";
import { useAuth } from "../../Login/context/useAuth";
import Footer from "../../../components/Footer";
import OrderStatusChange from "../../components/ListOrders/OrderStatusChange";

type DeliveryNavigationProp = NativeStackNavigationProp<DeliveryStackParamList>;

export default function ListOrdersToDistributePage() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  // 🔹 Mantenemos los pedidos del mock validando estados
  const [orders, setOrders] = useState<LogisticOrder[]>(
    mockOrders.map((o) => ({
      ...o,
      status: Object.values(OrderStatus).includes(o.status as OrderStatus)
        ? (o.status as OrderStatus)
        : OrderStatus.Issued,
    }))
  );

  const navigation = useNavigation<DeliveryNavigationProp>();
  const { name, role, team, isAuthenticated, logout } = useAuth();
  const user = { name: name ?? "", role: role ?? "", team: team ?? null };

  // 🔹 Estados que se deben mostrar (Delivery + Tesorería inicial)
  const allowedStatuses: OrderStatus[] = [
    OrderStatus.Issued,
    OrderStatus.Confirmed,
    OrderStatus.InPreparation,
    OrderStatus.OnTheWay,
    OrderStatus.Canceled,
    OrderStatus.ReIssued,
  ];

  // 🔹 Filtrado exacto (solo los permitidos, sin fallback)
  const filteredOrders = useMemo(
    () => orders.filter((o) => allowedStatuses.includes(o.status)),
    [orders]
  );

  // --- Handlers ---
  const handleConfirmOrder = (order: LogisticOrder) => {
    setSelectedOrderId(order.id);
    setShowConfirmModal(true);
  };

  const confirmOrder = () => {
    if (selectedOrderId === null) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === selectedOrderId
          ? { ...o, status: OrderStatus.Confirmed, rejectReason: "" }
          : o
      )
    );
    setShowConfirmModal(false);
    setSelectedOrderId(null);
  };

  const handleRejectOrder = (orderId: number) => {
    setSelectedOrderId(orderId);
    setShowRejectModal(true);
  };

  const rejectOrder = (reason: string) => {
    if (selectedOrderId === null) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === selectedOrderId
          ? { ...o, status: OrderStatus.Canceled, rejectReason: reason }
          : o
      )
    );
    setShowRejectModal(false);
    setSelectedOrderId(null);
  };

  const handleStatusUpdate = (updatedOrder: LogisticOrder) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );
  };

  const handleTraceRouteWrapper = () => {
    const onTheWayOrders = filteredOrders.filter(
      (o) => o.status === OrderStatus.OnTheWay
    );
    if (onTheWayOrders.length === 0) {
      Alert.alert(
        "No hay pedidos en camino",
        "Solo puedes abrir la ruta cuando haya pedidos 'En Camino'."
      );
      return;
    }
    const allOnTheWay = filteredOrders.every(
      (o) => o.status === OrderStatus.OnTheWay
    );
    if (!allOnTheWay) {
      Alert.alert(
        "No permitido",
        "Solo puedes abrir la ruta cuando TODOS los pedidos estén 'En Camino'."
      );
      return;
    }
    navigation.navigate("OrdersRouteMap", { orders: onTheWayOrders });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      <NavbarDelivery
        user={user}
        isAuthenticated={isAuthenticated}
        logout={logout}
      />
      <View style={{ marginTop: 8, marginLeft: 16 }}>
        <GetBack />
      </View>
      <Text style={styles.title}>Pedidos para repartir</Text>
      <View style={{ alignItems: "flex-end", marginRight: 16 }}>
        <OrdersCountToDistribute
          confirmedOrders={
            filteredOrders.filter((o) => o.status === OrderStatus.Confirmed)
              .length
          }
          onThresholdReached={(v) => console.log("Threshold reached:", v)}
        />
      </View>
      {filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No hay pedidos disponibles con los estados seleccionados.
          </Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ padding: 16 }}
          data={filteredOrders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <ListOrdersToDistributeComponent
                id={item.id}
                customer={
                  typeof item.customer === "string"
                    ? item.customer
                    : `${item.customer.firstName} ${item.customer.lastName}`
                }
                address={item.deliveryAddress?.street ?? ""}
                status={item.status}
                priority={item.priority}
                onConfirm={() => handleConfirmOrder(item)}
                onReject={() => handleRejectOrder(item.id)}
                onSeeDetail={() =>
                  navigation.navigate("OrderDetail", { order: item })
                }
                onOpenInMap={() =>
                  navigation.navigate("OneOrderRouteMap", { order: item })
                }
                onPreparation={() =>
                  navigation.navigate("OrderStatusChange", { order: item })
                }
              />
              <OrderStatusChange
                order={item}
                onStatusUpdate={handleStatusUpdate}
              />
            </View>
          )}
        />
      )}
      <TouchableOpacity
        style={[
          styles.traceButton,
          {
            backgroundColor: filteredOrders.length > 0 &&
              filteredOrders.every((o) => o.status === OrderStatus.OnTheWay)
                ? "#007bff"
                : "#ccc",
          },
        ]}
        onPress={handleTraceRouteWrapper}
        disabled={
          filteredOrders.length === 0 ||
          !filteredOrders.every((o) => o.status === OrderStatus.OnTheWay)
        }
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>
          Trazar Ruta (Pedidos en camino)
        </Text>
      </TouchableOpacity>
      <ConfirmOrderModal
        visible={showConfirmModal}
        orderId={selectedOrderId}
        onConfirm={confirmOrder}
        onCancel={() => {
          setShowConfirmModal(false);
          setSelectedOrderId(null);
        }}
      />
      <RejectOrderModal
        visible={showRejectModal}
        orderId={selectedOrderId}
        onReject={rejectOrder}
        onCancel={() => {
          setShowRejectModal(false);
          setSelectedOrderId(null);
        }}
      />
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
  card: {
    marginBottom: 16,
  },
  traceButton: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: "center",
  },
});
