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

type DeliveryNavigationProp = NativeStackNavigationProp<DeliveryStackParamList>;

export default function ListOrdersToIncidentPage() {
  const navigation = useNavigation<DeliveryNavigationProp>();
  const [orders] = useState(initialOrders);

  const mockUser = {
    name: "Carlos",
    role: "Repartidor",
    team: { teamName: "Zona Oeste" },
  };

  const handleLogout = () => console.log("🚪 Sesión cerrada");

  const handleReportIncident = (orderId: number) => {
    console.log("Reportar incidencia del pedido", orderId);
  };

  const handleViewIncidents = (orderId: number) => {
    console.log("Ver incidencias del pedido", orderId);
  };

  return (
    <View style={styles.container}>
      <NavbarDelivery
        user={mockUser}
        isAuthenticated={true}
        logout={handleLogout}
      />

      <View style={styles.backContainer}>
        <GetBack />
      </View>

      <Text style={styles.title}>Pedidos con Incidencias</Text>

      <FlatList
        data={orders.filter((o) => o.status === "INCIDENT")}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ListOrdersToIncidentComponent
            id={item.id}
            customer={item.customer}
            address={item.address}
            status={item.status}
            priority={item.priority}
            onSeeDetail={() =>
              navigation.navigate("OrderDetail", { order: item })
            }
            onReportIncident={() => handleReportIncident(item.id)}
            onViewIncidents={() => handleViewIncidents(item.id)}
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
