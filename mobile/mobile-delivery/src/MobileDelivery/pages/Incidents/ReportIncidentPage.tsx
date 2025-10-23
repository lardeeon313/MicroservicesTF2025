import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
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
  const { orderId } = route.params;

  const { reportIncident, isLoading } = useReportDeliveryIncident();
  const { userId, name, role, team, isAuthenticated, logout } = useAuth();

  
  if (!isAuthenticated || !userId || !name || !role) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Debes iniciar sesión para ver los pedidos con faltantes.</Text>
      </View>
    );
  }

  const teamName = typeof team === "object" ? team?.teamName : team;
  const user = { name: name ?? "", role: role ?? "", team: teamName ?? null };

  const [order, setOrder] = useState<LogisticOrder | null>(null);
  const [loadingOrder, setLoadingOrder] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
});
