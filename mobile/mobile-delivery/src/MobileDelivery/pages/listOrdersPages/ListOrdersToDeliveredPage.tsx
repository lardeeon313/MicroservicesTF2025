<<<<<<< HEAD
import React, { useState } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";

=======
import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text, ActivityIndicator,TouchableOpacity } from "react-native";
>>>>>>> aa9e73b (Desarrollo del mobile-delivery: implementación del código de Docker para que funcione con los demás microservicios, implementación de todos los endpoints del backend del mobile-delivery, cambios realizados en los Command Handler y en el código de Infrastructure de LogisticOrderRepository (había muchos filtros que impedían incluso traer pedidos))
import NavbarDelivery from "../../components/Navbar/NavbarDelivery";
import GetBack from "../../../components/GetBack";
import { mockOrders as initialOrders } from "../../MockPrueba/mockOrders";
import ListOrdersToDeliveredComponent from "../../components/ListOrders/ListOrdersToDelivered";
import Footer from "../../../components/Footer";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DeliveryStackParamList } from "../../types/DeliveryStackType";
<<<<<<< HEAD
import { DeliveryOrderTypeDto } from "../../types/DeliveryOrderTypeDto";

import ConfirmPaymentModal from "../../components/ConfirmPayment/ConfirmPaymentModal";
import { useAuth } from "../../Login/context/useAuth"; // 👈 Importamos el hook del AuthContext

type DeliveryNavigationProp = NativeStackNavigationProp<DeliveryStackParamList>;

=======
import { LogisticOrder, OrderStatus } from "../../types/DeliveryOrderTypeDto";
import ListOrdersToDeliveredComponent from "../../components/ListOrders/ListOrdersToDelivered";
import { useAuth } from "../../Login/context/useAuth";
import { useMyDeliveredOrders } from "../../hocks/useOrdersToDelivered";
import { PriorityType } from "../../types/DeliveryOrderTypeDto";
import { Banknote } from 'lucide-react-native';

type DeliveryNavigationProp = NativeStackNavigationProp<DeliveryStackParamList>;


const mapPriority = (priority?: string): string => {
  switch (priority?.toLowerCase()) {
    case "high": return "Urgente";
    case "medium": return "Media";
    case "low": return "Baja";
    default: return PriorityType.Low;
  }
};

const mapPaymentToSpanish = (payment?: string | null): string => {
  switch (payment?.toLowerCase()) {
    case "credit_card": return "Tarjeta de crédito";
    case "debit_card": return "Tarjeta de débito";
    case "transfer": return "Transferencia";
    case "cash": return "Efectivo";
    case "current_account": return "Cuenta corriente";
    case "check": return "Cheque";
    case "promissory_note": return "Pagaré";
    default: return "Desconocido";
  }
}

const mapStatusToSpanish = (status?: string | null ) : string => {
  switch (status?.toLowerCase()) {
    case "delivered": return "Entregado";
    case "ontheway" : return "En camino";
    case "assigneddelivery" : return "Asignado";
    case "pendingdelivery" : return "Confirmado";
    case "pendingincidentresolution": return "Pedido con Incidente No resuelto";
    case "pendingcashverification": return "En espera de verificacion...";
    case "cashverified" : return "¡Verificado por tesoreria!"
    default: return "Desconocido"
  }
}


>>>>>>> aa9e73b (Desarrollo del mobile-delivery: implementación del código de Docker para que funcione con los demás microservicios, implementación de todos los endpoints del backend del mobile-delivery, cambios realizados en los Command Handler y en el código de Infrastructure de LogisticOrderRepository (había muchos filtros que impedían incluso traer pedidos))
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

<<<<<<< HEAD
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
=======
      {/* 🔹 Botón arriba del listado */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("OrdersPendingCashVerification")}
        activeOpacity={0.8}
      >
        <View style={styles.buttonContent}>
          <Banknote size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>
            Revisa los pedidos en proceso de verificación por tesorería que hayan sido pagados en efectivo
          </Text>
          <Banknote size={20} color="#fff" style={styles.icon} />
        </View>
      </TouchableOpacity>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      )}
>>>>>>> aa9e73b (Desarrollo del mobile-delivery: implementación del código de Docker para que funcione con los demás microservicios, implementación de todos los endpoints del backend del mobile-delivery, cambios realizados en los Command Handler y en el código de Infrastructure de LogisticOrderRepository (había muchos filtros que impedían incluso traer pedidos))

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
<<<<<<< HEAD
=======
  center: { alignItems: "center", justifyContent: "center", marginTop: 40 },
  errorText: { color: "red", fontSize: 16, textAlign: "center" },
  statusContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#E8F5E9",
    borderWidth: 1,
    borderColor: "#81C784",
  },
  statusMessage: {
    fontSize: 16,
    color: "#2E7D32",
    textAlign: "center",
    fontWeight: "600",
  },
    button: {
    backgroundColor: "#3B82F6",
    alignSelf: "center",
    width: "90%",
    marginBottom: 15,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#3B82F6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
    lineHeight: 20,
  },
  icon: {
    marginHorizontal: 4,
  },
>>>>>>> aa9e73b (Desarrollo del mobile-delivery: implementación del código de Docker para que funcione con los demás microservicios, implementación de todos los endpoints del backend del mobile-delivery, cambios realizados en los Command Handler y en el código de Infrastructure de LogisticOrderRepository (había muchos filtros que impedían incluso traer pedidos))
});
