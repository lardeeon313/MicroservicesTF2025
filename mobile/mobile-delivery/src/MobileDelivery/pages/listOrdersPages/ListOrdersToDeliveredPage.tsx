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

type DeliveryNavigationProp = NativeStackNavigationProp<DeliveryStackParamList>;

export default function ListOrdersToDeliveredPage() {
  const navigation = useNavigation<DeliveryNavigationProp>();
  const [orders, setOrders] = useState(initialOrders);

  const mockUser = {
    name: "Carlos",
    role: "Repartidor",
    team: { teamName: "Zona Oeste" },
  };

  const handleLogout = () => console.log("🚪 Sesión cerrada");

  // actualizar pedido desde PaymentTypeComponent
  const updateOrderStatus = (orderId: number, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o
      )
    );
  };

  // confirmar rendición
  const handleRenderOrder = (orderId: number) => {
    console.log(`✅ Pedido ${orderId} rendido`);
    updateOrderStatus(orderId, "RENDERED"); // 👈 nuevo estado
  };

  return (
    <View style={styles.container}>
      <NavbarDelivery
        user={mockUser}
        isAuthenticated={true}
        logout={handleLogout}
      />

      <View style={styles.backContainer}>
        <GetBack />
      </View>

      <Text style={styles.title}>Pedidos Entregados</Text>

      <FlatList
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
            onSeeDetail={() =>
              navigation.navigate("OrderDetail", { order: item })
            }
            onPaymentType={() =>
              navigation.navigate("SelectPaymentType", {
                orderId: item.id,
                updateOrderStatus,
              })
            }
            onRenderOrder={handleRenderOrder}
          />
        )}
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
