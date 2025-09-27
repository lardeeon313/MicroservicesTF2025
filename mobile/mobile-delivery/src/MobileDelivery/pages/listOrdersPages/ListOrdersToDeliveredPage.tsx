import React, { useState } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";

import NavbarDelivery from "../../components/Navbar/NavbarDelivery";
import GetBack from "../../../components/GetBack";
import { mockOrders as initialOrders } from "../../MockPrueba/mockOrders";
import ListOrdersToDeliveredComponent from "../../components/ListOrders/ListOrdersToDelivered";
import Footer from "../../../components/Footer";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DeliveryStackParamList } from "../../types/DeliveryStackType";
import { DeliveryOrderTypeDto } from "../../types/DeliveryOrderTypeDto";

import ConfirmPaymentModal from "../../components/ConfirmPayment/ConfirmPaymentModal";
import { useAuth } from "../../Login/context/useAuth"; // 👈 Importamos el hook del AuthContext

type DeliveryNavigationProp = NativeStackNavigationProp<DeliveryStackParamList>;

export default function ListOrdersToDeliveredPage() {
  const navigation = useNavigation<DeliveryNavigationProp>();
  const [orders, setOrders] = useState(initialOrders);

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // ✅ Obtenemos user, isAuthenticated y logout del AuthContext
  const { name, role, team, isAuthenticated, logout } = useAuth();
  const user = {
    name: name ?? "",
    role: role ?? "",
    team: team ?? null,
  };

  // actualizar estado del pedido
  const updateOrderStatus = (
    orderId: number,
    newStatus: DeliveryOrderTypeDto["status"]
  ) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o
      )
    );
  };

  // abrir modal de confirmación de pago
  const handleOpenPaymentModal = (orderId: number) => {
    setSelectedOrderId(orderId);
    setModalVisible(true);
  };

  // confirmar pago desde modal
  const handleConfirmPayment = () => {
    if (selectedOrderId !== null) {
      updateOrderStatus(selectedOrderId, "PAYMENT_CONFIRMED");
      console.log(`💰 Pago confirmado para pedido ${selectedOrderId}`);
    }
  };

  // confirmar rendición
  const handleRenderOrder = (orderId: number) => {
    console.log(`✅ Pedido ${orderId} rendido`);
    updateOrderStatus(orderId, "RENDERED");
  };

  return (
    <View style={styles.container}>
      
      <NavbarDelivery
        user={user}
        isAuthenticated={isAuthenticated}
        logout={logout}
      />

      <View style={styles.backContainer}>
        <GetBack />
      </View>

      <Text style={styles.title}>Pedidos Entregados</Text>

      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={orders.filter(
          (o) => o.status === "DELIVERED" || o.status === "PENDING_VERIFIED"
        )}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ListOrdersToDeliveredComponent
            id={item.id}
            customer={item.customer}
            address={item.address}
            status={item.status}
            priority={item.priority}
            payment={item.payment}
            onSeeDetail={() =>
              navigation.navigate("OrderDetail", { order: item })
            }
            onPaymentType={() => handleOpenPaymentModal(item.id)}
            onRenderOrder={handleRenderOrder}
          />
        )}
      />

      {/* Modal de confirmación de pago */}
      <ConfirmPaymentModal
        visible={modalVisible}
        orderId={selectedOrderId?.toString() ?? ""}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmPayment}
      />

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backContainer: { marginTop: 10, marginLeft: 10 },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
});
