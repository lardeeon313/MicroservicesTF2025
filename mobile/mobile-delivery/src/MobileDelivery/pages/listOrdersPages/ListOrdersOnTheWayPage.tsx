import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  Linking,
  Modal,
  TouchableOpacity,
} from "react-native";
import NavbarDelivery from "../../components/Navbar/NavbarDelivery";
import GetBack from "../../../components/GetBack";
import Footer from "../../../components/Footer";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DeliveryStackParamList } from "../../types/DeliveryStackType";
import ListOrdersToOnTheWayComponent from "../../components/ListOrders/ListOrdersToOnTheWay";
import { useAuth } from "../../Login/context/useAuth";
import { useMyOnTheWayOrders } from "../../hocks/useOrdersToOnTheWay";
import { useMarkOrderDelivered } from "../../hocks/useMarkOrderDelivered";
import { LogisticOrder, PriorityType } from "../../types/DeliveryOrderTypeDto";

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
    case "ontheway": return "En camino";
    default: return "Desconocido"
  }
}

export default function ListOrdersOnTheWayPage() {
  const navigation = useNavigation<DeliveryNavigationProp>();
  const { userId, name, role, team, isAuthenticated, logout } = useAuth();
  const { orders, loading, error } = useMyOnTheWayOrders(userId ?? "");
  const { markDelivered, isLoading, success, error: deliveryError } = useMarkOrderDelivered();

  const [selectedOrder, setSelectedOrder] = useState<LogisticOrder | null>(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  useEffect(() => {
    if (success && selectedOrder) {
      setConfirmModalVisible(false);

      const paymentType = selectedOrder.paymentType?.toString().toLowerCase();
      if (paymentType === "cash") {
        setResultMessage(
          "💰 El pedido ha sido enviado a Tesorería para su verificación de pago en efectivo."
        );
      } else {
        setResultMessage("✅ El pedido ha sido entregado correctamente. \n Ahora se encuentra dentro del listado de Pedidos Entregados");
      }

      setResultModalVisible(true);
    } else if (deliveryError) {
      setResultMessage("❌ No se pudo marcar la orden como entregada.");
      setResultModalVisible(true);
    }
  }, [success, deliveryError]);

  if (!isAuthenticated || !userId || !name || !role) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Debes iniciar sesión para ver los pedidos con faltantes.</Text>
      </View>
    );
  }

  const teamName = typeof team === "object" ? team?.teamName : team;
  const user = { name: name ?? "", role: role ?? "", team: teamName ?? null };

  const handleSeeDetail = (order: LogisticOrder) => {
    navigation.navigate("OrderDetail", { order });
  };

  const handleSeeLocation = (order: LogisticOrder) => {
    const { street, number, city } = order.deliveryAddress;
    const query = encodeURIComponent(`${street} ${number}, ${city}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    Linking.openURL(url);
  };

  const handleConfirmReception = (order: LogisticOrder) => {
    setSelectedOrder(order);
    setConfirmModalVisible(true);
  };

  const confirmDelivery = async () => {
    if (!selectedOrder) return;
    await markDelivered(selectedOrder.id);
  };

  const handleReportIncident = (orderId: number) => {
    navigation.navigate("ReportIncident", { orderId });
  };

  return (
    <View style={styles.container}>
      <NavbarDelivery user={user} isAuthenticated={isAuthenticated} logout={logout} />

      <View style={styles.backContainer}>
        <GetBack />
      </View>

      <Text style={styles.title}>Pedidos en Camino</Text>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      )}

      {error && (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!loading && !error && (
        <FlatList
          contentContainerStyle={{ padding: 16 }}
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ListOrdersToOnTheWayComponent
              id={item.id}
              customer={`${item.customer.firstName} ${item.customer.lastName}`}
              address={item.deliveryAddress.formattedAddress ?? `${item.deliveryAddress.street} ${item.deliveryAddress.number}, ${item.deliveryAddress.city}`}
              status={mapStatusToSpanish(item.status)}
              priority={mapPriority(item.deliveryPriority)}
              payment={mapPaymentToSpanish(item.paymentType)}
              onSeeDetail={() => handleSeeDetail(item)}
              onSeeLocation={() => handleSeeLocation(item)}
              onConfirmReception={() => handleConfirmReception(item)}
              onReportIncident={() => handleReportIncident(item.id)}
            />
          )}
        />
      )}

      {/* ✅ Modal de Confirmación */}
      <Modal
        transparent
        visible={confirmModalVisible}
        animationType="fade"
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar recepción</Text>
            <Text style={styles.modalText}>
              ¿Deseas marcar el pedido #{selectedOrder?.id} como entregado?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#4CAF50" }]}
                onPress={confirmDelivery}
                disabled={isLoading}
              >
                <Text style={styles.modalButtonText}>
                  {isLoading ? "Procesando..." : "Confirmar"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#e11d48" }]}
                onPress={() => setConfirmModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ✅ Modal de Resultado */}
      <Modal
        transparent
        visible={resultModalVisible}
        animationType="fade"
        onRequestClose={() => setResultModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.resultModal}>
            <Text style={styles.modalText}>{resultMessage}</Text>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#3B82F6", marginTop: 16 }]}
              onPress={() =>{
                setResultModalVisible(false);
                navigation.navigate("Dashboard");
              }}
            >
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  center: { alignItems: "center", justifyContent: "center", marginTop: 40 },
  errorText: { color: "red", fontSize: 16, textAlign: "center" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "80%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  modalText: { fontSize: 16, textAlign: "center", marginBottom: 20 },
  modalButtons: { flexDirection: "row", justifyContent: "space-around" },
  modalButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  modalButtonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  resultModal: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "75%",
    alignItems: "center",
    elevation: 6,
  },
});

