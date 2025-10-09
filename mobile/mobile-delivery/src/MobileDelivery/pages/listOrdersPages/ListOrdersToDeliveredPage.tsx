import React, { useState } from "react";
import { View, FlatList, StyleSheet, Text, Alert } from "react-native";
import NavbarDelivery from "../../components/Navbar/NavbarDelivery";
import GetBack from "../../../components/GetBack";
import Footer from "../../../components/Footer";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DeliveryStackParamList } from "../../types/DeliveryStackType";
import { LogisticOrder, OrderStatus, PaymentType } from "../../types/DeliveryOrderTypeDto";
import { mockOrders as initialOrders } from "../../MockPrueba/mockOrders";
import ListOrdersToDeliveredComponent from "../../components/ListOrders/ListOrdersToDelivered";
import ConfirmPaymentModal from "../../components/ConfirmPayment/ConfirmPaymentModal";
import { useAuth } from "../../Login/context/useAuth";

type DeliveryNavigationProp = NativeStackNavigationProp<DeliveryStackParamList>;

export default function ListOrdersToDeliveredPage() {
  const navigation = useNavigation<DeliveryNavigationProp>();
  const [orders, setOrders] = useState<LogisticOrder[]>(initialOrders);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { name, role, team, isAuthenticated, logout } = useAuth();
  const user = { name: name ?? "", role: role ?? "", team: team ?? null };

  // actualizar estado de pedido
  const updateOrderStatus = (orderId: number, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  // abrir modal de confirmación de pago efectivo
  const handleRenderOrder = (orderId: number) => {
    updateOrderStatus(orderId, OrderStatus.PendingVerification);
    Alert.alert("Rendición realizada", `Pedido #${orderId} rendido correctamente`);
  };

  // abrir modal para pagos de Transfer, Credit/Debit
  const handleConfirmPayment = (order: LogisticOrder) => {
    switch (order.paymentType) {
      case PaymentType.Transfer:
      case PaymentType.Credit_Card:
      case PaymentType.Debit_Card:
        updateOrderStatus(order.id, OrderStatus.Verify);
        Alert.alert("Pago confirmado", `Pago de ${order.paymentType} confirmado`);
        break;

      case PaymentType.Current_Account:
        updateOrderStatus(order.id, OrderStatus.Verify);
        Alert.alert("Cuenta corriente confirmada", `Pedido #${order.id} confirmado por cuenta corriente`);
        break;

      case PaymentType.Check:
        updateOrderStatus(order.id, OrderStatus.Verify);
        Alert.alert("Cheque confirmado", `Pedido #${order.id} confirmado con cheque`);
        break;

      case PaymentType.Promissory_Note:
        updateOrderStatus(order.id, OrderStatus.Verify);
        Alert.alert("Nota promissoria confirmada", `Pedido #${order.id} confirmado con nota promissoria`);
        break;

      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <NavbarDelivery user={user} isAuthenticated={isAuthenticated} logout={logout} />
      <View style={styles.backContainer}>
        <GetBack />
      </View>

      <Text style={styles.title}>Pedidos Entregados</Text>

      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={orders.filter((o) => o.status === OrderStatus.Delivered)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ListOrdersToDeliveredComponent
            order={item}
            onSeeDetail={() => navigation.navigate("OrderDetail", { order: item })}
            onPaymentType={() => handleConfirmPayment(item)}
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
