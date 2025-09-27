import React, { useState } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";

import NavbarDelivery from "../../components/Navbar/NavbarDelivery";
import GetBack from "../../../components/GetBack";
import { mockOrders as initialOrders } from "../../MockPrueba/mockOrders";
import ListOrdersToVerifiedComponent from "../../components/ListOrders/ListOrdersToVerified";
import Footer from "../../../components/Footer";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DeliveryStackParamList } from "../../types/DeliveryStackType";

import { useAuth } from "../../Login/context/useAuth";

type DeliveryNavigationProp = NativeStackNavigationProp<DeliveryStackParamList>;

export default function ListOrdersToVerifiedPage() {
  const navigation = useNavigation<DeliveryNavigationProp>();
  const [orders] = useState(initialOrders);

  const { name, role, team, isAuthenticated, logout } = useAuth();
  const user = {
    name: name ?? "",
    role: role ?? "",
    team: team ?? null,
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

      <Text style={styles.title}>Pedidos Verificados</Text>

      <FlatList contentContainerStyle={{ padding: 16 }}
        data={orders.filter((o) => o.status === "VERIFIED")}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ListOrdersToVerifiedComponent
            id={item.id}
            customer={item.customer}
            address={item.address}
            status={item.status}
            priority={item.priority}
            onSeeDetail={() =>
              navigation.navigate("OrderDetail", { order: item })
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
