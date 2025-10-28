import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text, Modal, TouchableOpacity } from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { DeliveryStackParamList } from "../../types/DeliveryStackType";
import NavbarDelivery from "../../components/Navbar/NavbarDelivery";
import GetBack from "../../../components/GetBack";
import Footer from "../../../components/Footer";
import ReportIncidentComponent from "../../components/Incidents/ReportIncident";
import { useAuth } from "../../Login/context/useAuth";
import { useReportDeliveryIncident } from "../../hocks/useReportDelivery";
import { DeliveryIncidentStatus, LogisticOrder } from "../../types/DeliveryOrderTypeDto";
import API from "../../../services/axios";

type ReportIncidentRouteProp = RouteProp<DeliveryStackParamList, "ReportIncident">;

export default function ReportIncidentPage() {
  const route = useRoute<ReportIncidentRouteProp>();
  const navigation = useNavigation();
  const { orderId } = route.params;

  const { reportIncident, isLoading } = useReportDeliveryIncident();
  const { userId, name, role, team, isAuthenticated, logout } = useAuth();

  const [order, setOrder] = useState<LogisticOrder | null>(null);
  const [loadingOrder, setLoadingOrder] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successModalVisible, setSuccessModalVisible] = useState<boolean>(false);

  if (!isAuthenticated || !userId || !name || !role) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Debes iniciar sesión para ver los pedidos con faltantes.</Text>
      </View>
    );
  }

  const teamName = typeof team === "object" ? team?.teamName : team;
  const user = { name: name ?? "", role: role ?? "", team: teamName ?? null };

  // 🔹 Obtener pedido desde la API
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await API.get(`/logistic/DeliveryOperator/get-order-by-id/${orderId}`);
        setOrder(response.data);
      } catch (err: any) {
        console.error("❌ Error al obtener pedido:", err);
        setErrorMsg("No se pudo cargar la información del pedido.");
      } finally {
        setLoadingOrder(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // 🔹 Handler principal: reportar incidente
  const handleSubmitIncident = async (
    incidentType: DeliveryIncidentStatus,
    notes: string
  ) => {
    if (!order) {
      setErrorMsg("No se encontró el pedido.");
      return;
    }

    if (!userId) {
      setErrorMsg("No se pudo identificar al usuario operador.");
      return;
    }

    try {
      await reportIncident({
        logisticOrderId: order.id,
        operatorUserId: userId,
        incidentType,
        description: notes,
      });

      console.log("✅ Incidente reportado para el pedido:", order.id);

      // 🔹 Mostrar modal de éxito
      setSuccessModalVisible(true);

      // 🔹 Navegar automáticamente al Dashboard después de 2 segundos
      setTimeout(() => {
        setSuccessModalVisible(false);
        navigation.navigate("Dashboard" as never);
      }, 2000);
    } catch (err) {
      console.error("❌ Error al reportar incidente:", err);
      setErrorMsg("No se pudo reportar el incidente.");
    }
  };

  // ⏳ Mostrar loading mientras se carga el pedido
  if (loadingOrder) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NavbarDelivery
        user={user}
        isAuthenticated={isAuthenticated}
        logout={logout}
      />

      <View style={styles.content}>
        <View style={{ marginTop: 10, marginLeft: 10 }}>
          <GetBack />
        </View>

        {order ? (
          <ReportIncidentComponent
            order={order}
            onSubmit={handleSubmitIncident}
            isLoading={isLoading}
          />
        ) : (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>
              {errorMsg || "Pedido no encontrado. No se pudo cargar el pedido."}
            </Text>
          </View>
        )}
      </View>

      <Footer />

      {/* 🔹 Modal de éxito */}
      <Modal
        visible={successModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>✅ Incidente reportado</Text>
            <Text style={styles.modalMessage}>El incidente se registró correctamente.</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setSuccessModalVisible(false);
                navigation.navigate("Dashboard" as never);
              }}
            >
              <Text style={styles.modalButtonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  errorBox: {
    marginTop: 40,
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 12,
    alignItems: "center",
    width: "80%",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#28a745",
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
