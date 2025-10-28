import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Text, Modal, TouchableOpacity, ActivityIndicator } from "react-native";
import NavbarDelivery from "../../components/Navbar/NavbarDelivery";
import GetBack from "../../../components/GetBack";
import Footer from "../../../components/Footer";
import ListOrdersToDistributeComponent from "../../components/ListOrders/ListOrdersToDistribute";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DeliveryStackParamList } from "../../types/DeliveryStackType";
import { PriorityType } from "../../types/DeliveryOrderTypeDto";
import { useAuth } from "../../Login/context/useAuth";
import { useMyAssignedOrders } from "../../hocks/useOrdersToDistribute";
import { useMyPendingDeliveredOrders } from "../../hocks/usePendingDelivered";
import { LogisticOrder } from "../../types/DeliveryOrderTypeDto";
import { useMarkOrderOnTheWay } from "../../hocks/useMarkOrderOnTheWay";
import { PaymentType } from "../../types/DeliveryOrderTypeDto";

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
    case "assigneddelivery" : return "Asignado"; 
    case "pendingdelivery" : return "Confirmado";
    default: return "Desconocido"
  }
}

export default function ListOrdersToDistributePage() {
  const navigation = useNavigation<DeliveryNavigationProp>();
  const { userId, name, role, isAuthenticated, logout, team } = useAuth();
  const { markOnTheWay, loading, error, success } = useMarkOrderOnTheWay();

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false); // ✅ nuevo modal de confirmación UX

  const { orders: assignedOrders } = useMyAssignedOrders(userId ?? "");
  const { orders: pendingDeliveredOrders } = useMyPendingDeliveredOrders(userId ?? "");
  const allOrders = [...assignedOrders, ...pendingDeliveredOrders];

  

  if (!isAuthenticated || !userId || !name || !role) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Debes iniciar sesión para ver los pedidos con faltantes.</Text>
      </View>
    );
  }

  const teamName = typeof team === "object" ? team?.teamName : team;

// ✅ asegurás que name y role sean string
const user = { 
  name: name ?? "", 
  role: role ?? "", 
  team: teamName ?? null 
};

  const handleConfirmOrder = (order: LogisticOrder) => {
    navigation.navigate("ConfirmAssignedOrder", { order });
  };

  const handleRejectOrder = (order: LogisticOrder) => {
    navigation.navigate("RejectAssignedOrder", { order });
  };

  const handleMarkOnTheWay = (orderId: number) => {
    setSelectedOrderId(orderId);
    setModalVisible(true);
  };

  const handleConfirmModal = async () => {
    if (!selectedOrderId || !userId) return;
    try {
      await markOnTheWay({ logisticOrderId: selectedOrderId, operatorUserId: userId });
      setSuccessModalVisible(true); // ✅ abre el modal UX al terminar correctamente
    } catch (err) {
      console.error("❌ Error al marcar en camino:", err);
    } finally {
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <NavbarDelivery
        user={user} 
        isAuthenticated={isAuthenticated}
        logout={logout} 
      />
      <View style={styles.backContainer}><GetBack /></View>
      <Text style={styles.title}>Pedidos para distribuir</Text>

      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={allOrders.filter(o =>
          ["assigneddelivery", "pendingdelivery"].includes(o.status?.toLowerCase())
        )}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ListOrdersToDistributeComponent
            id={item.id}
            customer={`${item.customer.firstName} ${item.customer.lastName}`}
            address={item.deliveryAddress.formattedAddress ?? `${item.deliveryAddress.street} ${item.deliveryAddress.number}, ${item.deliveryAddress.city}`}
            status={mapStatusToSpanish(item.status)}
            priority={mapPriority(item.deliveryPriority)}
            payment={mapPaymentToSpanish(item.paymentType)}
            onConfirm={() => handleConfirmOrder(item)}
            onReject={() => handleRejectOrder(item)}
            onSeeDetail={() => navigation.navigate("OrderDetail", { order: item })}
            onMarkOnTheWay={() => handleMarkOnTheWay(item.id)}
          />
        )}
      />

      {/* Modal de confirmación */}
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

      {/* ✅ Modal UX/UI de éxito */}
      <Modal
        visible={successModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.successOverlay}>
          <View style={styles.successContainer}>
            <Text style={styles.successIcon}>🚚</Text>
            <Text style={styles.successTitle}>¡Pedido en camino!</Text>
            <Text style={styles.successMessage}>
              El pedido #{selectedOrderId} fue marcado exitosamente como "En camino".
            </Text>
            <Text style={styles.successSubtext}>
              Ahora podrás verlo en el listado de “Pedidos en camino”.
            </Text>

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
  backContainer: { marginTop: 10, marginLeft: 10 },
  title: { fontSize: 22, fontWeight: "600", marginTop: 20, marginBottom: 20, color: "#333", textAlign: "center" },

  // Modal Confirmación
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalContainer: { backgroundColor: "#fff", borderRadius: 10, padding: 20, width: "80%" },
  modalText: { fontSize: 18, textAlign: "center", marginBottom: 20 },
  modalButtons: { flexDirection: "row", justifyContent: "space-around" },
  modalButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  modalConfirm: { backgroundColor: "#4a9c13" },
  modalCancel: { backgroundColor: "#e41616" },
  modalButtonText: { color: "#fff", fontWeight: "bold" },
  errorText: { color: "#e41616", textAlign: "center", marginTop: 10 },

  // ✅ Modal UX/UI éxito
  successOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center" },
  successContainer: { backgroundColor: "#fff", borderRadius: 16, padding: 25, width: "80%", alignItems: "center" },
  successIcon: { fontSize: 50, marginBottom: 10 },
  successTitle: { fontSize: 22, fontWeight: "700", color: "#2e7d32", marginBottom: 8 },
  successMessage: { fontSize: 16, textAlign: "center", color: "#333", marginBottom: 5 },
  successSubtext: { fontSize: 14, textAlign: "center", color: "#666", marginBottom: 20 },
  successButton: { backgroundColor: "#2e7d32", paddingVertical: 10, paddingHorizontal: 30, borderRadius: 8 },
  successButtonText: { color: "#fff", fontWeight: "bold" },
});

