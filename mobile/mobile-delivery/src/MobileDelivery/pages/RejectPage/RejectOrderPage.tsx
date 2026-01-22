// src/pages/RejectAssignedOrderPage.tsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { DeliveryStackParamList } from "../../types/DeliveryStackType";
//import { useRejectAssignedOrder } from "../../hocks/useRejectAssignedOrder";
import { useRejectAssignedOrder } from "../../hocks/useRejectOrder";
import { useAuth } from "../../Login/context/useAuth";
//import RejectAssignedOrderComponent from "../../components/RejectAssignedOrder/RejectAssignedOrderComponent";
import RejectAssignedOrderComponent from "../../components/RejectOrder/RejectOrder";
import NavbarDelivery from "../../components/Navbar/NavbarDelivery";
import Footer from "../../../components/Footer";
import GetBack from "../../../components/GetBack";

type RejectAssignedOrderRouteProp = RouteProp<DeliveryStackParamList, "RejectAssignedOrder">;

export default function RejectAssignedOrderPage() {
  const { rejectOrder, loading, error, success } = useRejectAssignedOrder();
  const { userId, name, role, team, loading: authLoading, token, isAuthenticated, logout } = useAuth();
  const route = useRoute<RejectAssignedOrderRouteProp>();
  const navigation = useNavigation();
  const order = route.params?.order;

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  if (!isAuthenticated || !userId || !name || !role) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Debes iniciar sesión para poder rechazar el pedido.</Text>
      </View>
    );
  }
  const teamName = typeof team === "object" ? team?.teamName : team;
  const user = { 
    name: name ?? "", 
    role: role ?? "", 
    team: teamName ?? null 
  };

  const handleRejectOrder = async (reason: string) => {
    if (!order) {
      setModalMessage("No se encontró el pedido a rechazar.");
      setModalVisible(true);
      return;
    }

    await rejectOrder({
      logisticOrderId: order.id,
      operatorUserId: userId as unknown as string,
      reason,
    });
  };

  // Mostrar modal según resultado
  useEffect(() => {
    if (success) {
      setModalMessage(`El pedido #${order?.id} fue rechazado correctamente.`);
      setModalVisible(true);
    } else if (error) {
      setModalMessage(`Error al rechazar el pedido: ${error}`);
      setModalVisible(true);
    }
  }, [success, error]);

  const handleCloseModal = () => {
    setModalVisible(false);
    if (success) navigation.navigate('Dashboard' as never);
  };

  return (
    <View style={{ flex: 1 }}>
      <NavbarDelivery user={user} isAuthenticated={isAuthenticated} logout={logout} />
      <View style={{ marginTop: 10, marginLeft: 10 }}>
        <GetBack />
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
        <RejectAssignedOrderComponent
          order={order}
          loading={loading}
          onReject={handleRejectOrder}
        />
      </ScrollView>

      <Footer />

      {/* Modal de resultado */}
      <Modal transparent animationType="fade" visible={modalVisible} onRequestClose={handleCloseModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleCloseModal}>
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#e41616",
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
