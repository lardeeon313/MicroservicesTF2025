import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Modal, ScrollView, Alert } from "react-native";

import NavbarDelivery from "../../components/Navbar/NavbarDelivery";
import GetBack from "../../../components/GetBack";
import { mockOrders } from "../../MockPrueba/mockOrders";
import ListOrdersToDistributeComponent from "../../components/ListOrders/ListOrdersToDistribute";
import MapWithDirections from "../../components/ListOrders/MapWithDirections";
import Footer from "../../../components/Footer";
import OrdersCountToDistribute from "../../components/ListOrders/OrdersCountToDistribute";


import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DeliveryStackParamList } from "../../types/DeliveryStackType";

type DeliveryNavigationProp = NativeStackNavigationProp<DeliveryStackParamList>;


export default function ListOrdersToDistributePage() {
  const [selectedOrders, setSelectedOrders] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [canShowModal, setCanShowModal] = useState(false); // control del contador

  const navigation = useNavigation<DeliveryNavigationProp>();

  const orders = mockOrders.filter((o) => o.status === "TO_DISTRIBUTE");

  const mockUser = {
    name: "Carlos",
    role: "Repartidor",
    team: { teamName: "Zona Oeste" },
  };

  const handleLogout = () => console.log("🚪 Sesión cerrada");

  const toggleSelectOrder = (order: any) => {
    setSelectedOrders((prev) =>
      prev.find((o) => o.id === order.id)
        ? prev.filter((o) => o.id !== order.id)
        : [...prev, order]
    );
  };

  const handleTraceRoute = () => {
    if (selectedOrders.length < 3) {
      Alert.alert("⚠️ Atención", "Debes confirmar al menos 3 pedidos para trazar la ruta.");
      return;
    }
    setShowModal(true);
  };

  const handleConfirmDelivery = (orderId: number, delivered: boolean) => {
    Alert.alert(
      delivered ? "✅ Entregado" : "❌ No entregado",
      `Pedido ${orderId} ${delivered ? "entregado" : "no entregado"}`
    );
  };

  // 🔑 si queda solo 1 confirmado, cerrar modal automáticamente
  useEffect(() => {
    if (selectedOrders.length === 1 && showModal) {
      setShowModal(false);
    }
  }, [selectedOrders]);

  return (
    <View style={styles.container}>
      <NavbarDelivery user={mockUser} isAuthenticated={true} logout={handleLogout} />
      
      <View style={styles.backContainer}>
        <GetBack />
      </View>

      <Text style={styles.title}>Pedidos para repartir</Text>

      <View style={{ alignItems: "flex-end", marginRight: 16 }}>
        <OrdersCountToDistribute 
          confirmedOrders={selectedOrders.length} 
          onThresholdReached={setCanShowModal} 
        />
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ListOrdersToDistributeComponent
            id={item.id}
            customer={item.customer}
            address={item.address}
            status={item.status}
            priority={item.priority}
            onConfirm={() => toggleSelectOrder(item)}
            onReject={() => toggleSelectOrder(item)}
            onSeeDetail={() => navigation.navigate("OrderDetail", { order: item })}
          />
        )}
      />

      <TouchableOpacity
        style={[
          styles.traceButton,
          { backgroundColor: selectedOrders.length >= 3 ? "#007bff" : "#ccc" },
        ]}
        onPress={handleTraceRoute}
      >
        <Text style={styles.buttonText}>Trazar Ruta</Text>
      </TouchableOpacity>

      {/* Modal con Map y Confirmaciones */}
      <Modal visible={showModal} animationType="slide">
        <View style={{ flex: 1, paddingTop: 40 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>
            Ruta de Pedidos Seleccionados
          </Text>

          <MapWithDirections orders={selectedOrders} />

          <ScrollView style={{ padding: 16 }}>
            {selectedOrders.map((order) => (
              <View 
                key={order.id} 
                style={{ 
                  marginBottom: 12, 
                  backgroundColor: "#fff", 
                  padding: 12, 
                  borderRadius: 8, 
                  elevation: 3 
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>{order.customer}</Text>
                <Text>{order.address}</Text>

                <View style={{ flexDirection: "row", marginTop: 8 }}>
                  <TouchableOpacity
                    style={{ 
                      flex: 1, 
                      backgroundColor: "green", 
                      padding: 8, 
                      borderRadius: 6, 
                      marginRight: 5, 
                      alignItems: "center" 
                    }}
                    onPress={() => handleConfirmDelivery(order.id, true)}
                  >
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>Entregado</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ 
                      flex: 1, 
                      backgroundColor: "red", 
                      padding: 8, 
                      borderRadius: 6, 
                      marginLeft: 5, 
                      alignItems: "center" 
                    }}
                    onPress={() => handleConfirmDelivery(order.id, false)}
                  >
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>No entregado</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={{ 
              padding: 12, 
              backgroundColor: "#333", 
              margin: 16, 
              borderRadius: 8, 
              alignItems: "center" 
            }}
            onPress={() => setShowModal(false)}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Cerrar</Text>
          </TouchableOpacity>
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
    textAlign: "center" 
  },
  traceButton: { 
    padding: 12, 
    borderRadius: 8, 
    alignItems: "center", 
    marginHorizontal: 16, 
    marginBottom: 16 
  },
  buttonText: { 
    color: "white", 
    fontWeight: "bold" 
  },
});
