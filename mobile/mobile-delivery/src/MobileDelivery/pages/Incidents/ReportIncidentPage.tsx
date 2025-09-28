import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { DeliveryStackParamList } from "../../types/DeliveryStackType";
import NavbarDelivery from "../../components/Navbar/NavbarDelivery";
import GetBack from "../../../components/GetBack";
import Footer from "../../../components/Footer";
import ReportIncidentComponent from "../../components/Incidents/ReportIncident";
import { mockOrders } from "../../MockPrueba/mockOrders";

import { useAuth } from "../../Login/context/useAuth";


type ReportIncidentRouteProp = RouteProp<
  DeliveryStackParamList,
  "ReportIncident"
>;

export default function ReportIncidentPage() {
  const route = useRoute<ReportIncidentRouteProp>();
  const { orderId } = route.params;

  // 🔎 Buscamos el pedido en el mock (en producción lo pedirías a la API)
  const order = mockOrders.find((o) => o.id === orderId);

  const handleSubmitIncident = (notes: string) => {
    Alert.alert("Incidente registrado", `Notas: ${notes}`);
    console.log("🚨 Incidente enviado para el pedido:", orderId, "Notas:", notes);
  };

  const { name, role, team, isAuthenticated, logout } = useAuth();
  const user = {
    name: name ?? "",
    role: role ?? "",
    team: team ?? null,
  };
  

  return (
    <View style={styles.container}>
      <NavbarDelivery user={user} isAuthenticated={isAuthenticated}logout={logout}/>

      <View style={styles.content}>
        <View style={{ marginTop: 10, marginLeft: 10 }}>
          <GetBack />
        </View>

        {order ? (
          <ReportIncidentComponent order={order} onSubmit={handleSubmitIncident} />
        ) : (
          <View />
        )}
      </View>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: "space-between", // 📌 Footer siempre abajo
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
});
