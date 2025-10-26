import React, { useState } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";

import NavbarDelivery from "../../components/Navbar/NavbarDelivery";
import GetBack from "../../../components/GetBack";
import { mockOrders as initialOrders } from "../../MockPrueba/mockOrders";
import ListOrdersToIncidentComponent from "../../components/ListOrders/ListOrdersToIncidents";
import Footer from "../../../components/Footer";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DeliveryStackParamList } from "../../types/DeliveryStackType";
import { useAuth } from "../../Login/context/useAuth";
import { LogisticOrder } from "../../types/DeliveryOrderTypeDto"; // 👈 asegurate de importar tu nueva interfaz

type DeliveryNavigationProp = NativeStackNavigationProp<DeliveryStackParamList>;

export default function ListOrdersToIncidentPage() {
  const navigation = useNavigation<DeliveryNavigationProp>();
  const [orders, setOrders] = useState<LogisticOrder[]>(initialOrders);

  const { name, role, team, isAuthenticated, logout } = useAuth();
  const user = {
    name: name ?? "",
    role: role ?? "",
    team: team ?? null,
  };

  // 👉 Navegar a Reportar Incidente
  const handleReportIncident = (orderId: number) => {
    navigation.navigate("ReportIncident", { orderId });
  };

  // 👉 Ver incidencias registradas
  const handleViewIncidents = (orderId: number) => {
    navigation.navigate("NotificationIncident", { orderId });
  };

  // 👉 Filtrar pedidos con estado "WithIncidents"
  const ordersWithIncidents = orders.filter(
    (o) => o.status === "WithIncidents"
  );

  return (
    <View style={{ flex: 1 }}>
      <NavbarDelivery
        user={user}
        isAuthenticated={isAuthenticated}
        logout={logout}
      />

      <View style={styles.backContainer}>
        <GetBack />
      </View>

      <Text style={styles.title}>Pedidos con Incidentes</Text>

      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={ordersWithIncidents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ListOrdersToIncidentComponent
            id={item.id}
            customer={item.customer?.firstName + item.customer.lastName || "Cliente desconocido"}
            address={
              item.deliveryAddress?.formattedAddress ||
              `${item.deliveryAddress?.street ?? ""} ${item.deliveryAddress?.number ?? ""}`
            }
            status={item.status}
            priority={item.priority}
            incidentCount={item.items.filter((i) => i.hasIncident).length || 0} // 👈 si tenés flag por item
            onSeeDetail={() =>
              navigation.navigate("OrderDetail", { order: item })
            }
            onReportIncident={() => handleReportIncident(item.id)}
            onViewIncidents={() => handleViewIncidents(item.id)}
            onOpenInMap={() =>
              navigation.navigate("OneOrderRouteMap", { order: item })
            }
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
