import React, { useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
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
import { useValidationOrdersLogic } from "../../validations/ValidationOrdersToDistribute";
import { DeliveryOrderTypeDto } from "../../types/DeliveryOrderTypeDto";
import ConfirmOrderModal from "../../components/ConfirmOrder/ConfirmOrder";
import RejectOrderModal from "../../components/RejectOrder/RejectOrder";

type DeliveryNavigationProp = NativeStackNavigationProp<DeliveryStackParamList>;

export default function ListOrdersToDistributePage() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [orders, setOrders] = useState(mockOrders.filter((o) => o.status === "TO_DISTRIBUTE"));
  const {
    selectedOrders,
    showModal,
    setShowModal,
    toggleSelectOrder,
    handleTraceRoute,
  } = useValidationOrdersLogic(orders as DeliveryOrderTypeDto[]);
  const navigation = useNavigation<DeliveryNavigationProp>();
  const mockUser = {
    name: "Carlos",
    role: "Repartidor",
    team: { teamName: "Zona Oeste" },
  };


  const handleLogout = () => console.log("🚪 Sesión cerrada");

  // Manejo de confirmación de pedido
  const handleConfirmOrder = (order: DeliveryOrderTypeDto) => {
    setSelectedOrderId(order.id);
    setShowConfirmModal(true);
  };

  // Manejo de rechazo de pedido
  const handleRejectOrder = (orderId: number) => {
    setSelectedOrderId(orderId);
    setShowRejectModal(true);
  };

  // Confirmar pedido (cambiar estado a CONFIRM)
  const confirmOrder = () => {
      if (selectedOrderId === null) return;
  const orderToUpdate = orders.find((order) => order.id === selectedOrderId);
  if (orderToUpdate) {
    const updatedOrder: DeliveryOrderTypeDto = {
      ...orderToUpdate,
      status: "CONFIRM",
      rejectReason: orderToUpdate.rejectReason || "", // Asegúrate de incluir rejectReason
    };
    setOrders((prevOrders: DeliveryOrderTypeDto[]) =>
      prevOrders.map((order) =>
        order.id === selectedOrderId ? updatedOrder : { ...order, rejectReason: order.rejectReason || "" }
      )
    );
    toggleSelectOrder(updatedOrder);
  }
  setShowConfirmModal(false);
  };

const rejectOrder = (reason: string) => {
    if (selectedOrderId === null) return;
  setOrders((prevOrders: DeliveryOrderTypeDto[]) =>
    prevOrders.map((order) => {
      if (order.id === selectedOrderId) {
        const updatedOrder: DeliveryOrderTypeDto = {
          ...order,
          status: "PENDING_CONFIRMED",
          rejectReason: reason,
          incidentCount: order.incidentCount !== undefined ? order.incidentCount : 0,
        };
        return updatedOrder;
      }
      const currentOrder: DeliveryOrderTypeDto = {
        ...order,
        incidentCount: order.incidentCount !== undefined ? order.incidentCount : 0,
      };
      return currentOrder;
    })
  );
  setShowRejectModal(false);
  setRejectReason("");
};


  // Confirmar entrega (lógica existente)
  const handleConfirmDelivery = (orderId: number, delivered: boolean) => {
    Alert.alert(
      delivered ? "✅ Entregado" : "❌ No entregado",
      `Pedido ${orderId} ${delivered ? "entregado" : "no entregado"}`
    );
  };

  // Trazar ruta solo si hay pedidos CONFIRM
  const handleTraceRouteWrapper = () => {
      const hasConfirmedOrders = selectedOrders.some((order) => order.status === "CONFIRM");
  if (hasConfirmedOrders) {
    handleTraceRoute();
  } else {
    Alert.alert("Error", "Solo puedes trazar rutas para pedidos confirmados.");
  }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      <NavbarDelivery user={mockUser} isAuthenticated={true} logout={handleLogout} />
      <View style={{ marginTop: 8, marginLeft: 16 }}>
        <GetBack />
      </View>
      <Text style={{ fontSize: 22, fontWeight: "bold", margin: 16, textAlign: "center" }}>
        Pedidos para repartir
      </Text>
      <View style={{ alignItems: "flex-end", marginRight: 16 }}>
        <OrdersCountToDistribute
          confirmedOrders={selectedOrders.filter(o => o.status === "CONFIRM").length}
          onThresholdReached={(value: boolean) => console.log("Threshold reached:", value)}
        />
      </View>
      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ListOrdersToDistributeComponent
            id={item.id}
            customer={item.customer}
            address={item.address}
            status={item.status}
            priority={item.priority}
            onConfirm={() => handleConfirmOrder(item)}
            onReject={() => handleRejectOrder(item.id)}
            onSeeDetail={() => navigation.navigate("OrderDetail", { order: item })}
          />
        )}
      />
      <TouchableOpacity
        style={[
          {
            padding: 16,
            borderRadius: 8,
            margin: 16,
            alignItems: "center",
            backgroundColor: selectedOrders.some((o) => o.status === "CONFIRM") ? "#007bff" : "#ccc",
          },
        ]}
        onPress={handleTraceRouteWrapper}
        disabled={!selectedOrders.some((o) => o.status === "CONFIRM")}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Trazar Ruta</Text>
      </TouchableOpacity>

      {/* Modal de Confirmación */}
      <ConfirmOrderModal
        visible={showConfirmModal}
        orderId={selectedOrderId}
        onConfirm={confirmOrder}
        onCancel={() => setShowConfirmModal(false)}
      />

      {/* Modal de Rechazo */}
      <RejectOrderModal
        visible={showRejectModal}
        orderId={selectedOrderId}
        onReject={rejectOrder}
        onCancel={() => setShowRejectModal(false)}
      />

      {/* Modal de Mapa (existente) */}
      <Modal visible={showModal} animationType="slide">
        <View style={{ flex: 1, paddingTop: 40, backgroundColor: "#fff" }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>
            Ruta de Pedidos Seleccionados
          </Text>
          <View style={{ flex: 1 }}>
            <MapWithDirections orders={selectedOrders} />
          </View>
          <View style={{ flex: 1 }}>
            <ScrollView style={{ padding: 16 }}>
              {selectedOrders.map((order) => (
                <View
                  key={order.id}
                  style={{
                    marginBottom: 12,
                    backgroundColor: "#fff",
                    padding: 12,
                    borderRadius: 8,
                    elevation: 3,
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
                        alignItems: "center",
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
                        alignItems: "center",
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
                alignItems: "center",
              }}
              onPress={() => setShowModal(false)}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Footer />
    </View>
  );
}
