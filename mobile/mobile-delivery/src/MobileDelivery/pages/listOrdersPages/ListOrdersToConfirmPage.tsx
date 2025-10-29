import React, { useState } from "react";
import { View, FlatList, StyleSheet, Text, Modal, TouchableOpacity, ActivityIndicator } from "react-native";
import NavbarDelivery from "../../components/Navbar/NavbarDelivery";
import GetBack from "../../../components/GetBack";
import Footer from "../../../components/Footer";
import OrdersNotFound from "../../../components/OrdersNotFound";
import ListOrdersToConfirm from "../../components/ListOrders/ListOrdersToConfirm";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DeliveryStackParamList } from "../../types/DeliveryStackType";
import { useAuth } from "../../Login/context/useAuth";
import { useMyPendingDeliveredOrders } from "../../hocks/usePendingDelivered";
import { useMarkOrderOnTheWay } from "../../hocks/useMarkOrderOnTheWay";
import { PriorityType, LogisticOrder } from "../../types/DeliveryOrderTypeDto";

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

const mapStatusToSpanish = (status?: string | null): string => {
  switch (status?.toLowerCase()) {
    case "pendingdelivery": return "Confirmado";
    default: return "Desconocido";
  }
};

export default function ListPendingDeliveryPage() {
  const navigation = useNavigation<DeliveryNavigationProp>();
  const { userId, name, role, isAuthenticated, logout, team } = useAuth();
  const { markOnTheWay, loading, error } = useMarkOrderOnTheWay();
  const { orders: pendingDeliveredOrders } = useMyPendingDeliveredOrders(userId ?? "");

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const teamName = typeof team === "object" ? team?.teamName : team;
  const user = { name: name ?? "", role: role ?? "", team: teamName ?? null };

  const handleMarkOnTheWay = (orderId: number) => {
    setSelectedOrderId(orderId);
    setModalVisible(true);
  };

  const handleConfirmModal = async () => {
    if (!selectedOrderId || !userId) return;
    try {
      await markOnTheWay({ logisticOrderId: selectedOrderId, operatorUserId: userId });
      setSuccessModalVisible(true);
    } catch (err) {
      console.error("❌ Error al marcar en camino:", err);
    } finally {
      setModalVisible(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.center}>
        <Text>Debes iniciar sesión para ver los pedidos confirmados.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NavbarDelivery user={user} isAuthenticated={isAuthenticated} logout={logout} />
      <View style={styles.backContainer}><GetBack /></View>
      <Text style={styles.title}>Pedidos Confirmados</Text>

      {pendingDeliveredOrders.length === 0 ? (
        <OrdersNotFound
          icon="✅"
          title="No hay pedidos confirmados."
          message="Por el momento no tienes pedidos listos para entregar.Vuelve a intentarlo mas tarde.."
          buttonText="Actualizar"
          onRefresh={() => {}}
        />
      ) : (
        <FlatList
          contentContainerStyle={{ padding: 16 }}
          data={pendingDeliveredOrders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ListOrdersToConfirm
              id={item.id}
              customer={`${item.customer.firstName} ${item.customer.lastName}`}
              address={
                item.deliveryAddress.formattedAddress ??
                `${item.deliveryAddress.street}, ${item.deliveryAddress.number}, ${item.deliveryAddress.city}`
              }
              status={mapStatusToSpanish(item.status)}
              priority={mapPriority(item.deliveryPriority)}
              payment={mapPaymentToSpanish(item.paymentType)}
              onSeeDetail={() => navigation.navigate("OrderDetail", { order: item })}
              onMarkOnTheWay={() => handleMarkOnTheWay(item.id)}
            />
          )}
        />
      )}

      {/* Modal confirmar "En camino" */}
      <Modal visible={modalVisible} animationType="fade" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              ¿Deseas marcar el pedido #{selectedOrderId} como "En camino"?
            </Text>

            {loading ? (
              <ActivityIndicator size="large" color="#4a9c13" />
            ) : (
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalButton, styles.modalConfirm]} onPress={handleConfirmModal}>
                  <Text style={styles.modalButtonText}>Sí</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.modalCancel]} onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            )}

            {error && <Text style={styles.errorText}>⚠️ {error}</Text>}
          </View>
        </View>
      </Modal>

      {/* Modal de éxito */}
      <Modal visible={successModalVisible} animationType="fade" transparent onRequestClose={() => setSuccessModalVisible(false)}>
        <View style={styles.successOverlay}>
          <View style={styles.successContainer}>
            <Text style={styles.successIcon}>🚚</Text>
            <Text style={styles.successTitle}>¡Pedido en camino!</Text>
            <TouchableOpacity
              style={styles.successButton}
              onPress={() => {
                setSuccessModalVisible(false);
                navigation.navigate("Dashboard");
              }}
            >
              <Text style={styles.successButtonText}>Entendido</Text>
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
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  backContainer: { marginTop: 10, marginLeft: 10 },
  title: { fontSize: 22, fontWeight: "700", marginVertical: 20, textAlign: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalContainer: { backgroundColor: "#fff", borderRadius: 10, padding: 20, width: "80%" },
  modalText: { fontSize: 18, textAlign: "center", marginBottom: 20 },
  modalButtons: { flexDirection: "row", justifyContent: "space-around" },
  modalButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  modalConfirm: { backgroundColor: "#4a9c13" },
  modalCancel: { backgroundColor: "#e41616" },
  modalButtonText: { color: "#fff", fontWeight: "bold" },
  errorText: { color: "#e41616", textAlign: "center", marginTop: 10 },
  successOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center" },
  successContainer: { backgroundColor: "#fff", borderRadius: 16, padding: 25, width: "80%", alignItems: "center" },
  successIcon: { fontSize: 50, marginBottom: 10 },
  successTitle: { fontSize: 22, fontWeight: "700", color: "#2e7d32", marginBottom: 8 },
  successButton: { backgroundColor: "#2e7d32", paddingVertical: 10, paddingHorizontal: 30, borderRadius: 8 },
  successButtonText: { color: "#fff", fontWeight: "bold" },
});
