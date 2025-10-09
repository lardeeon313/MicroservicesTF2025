import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  Modal,
  StyleSheet,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DeliveryStackParamList } from "../../types/DeliveryStackType";
import { LogisticOrder, OrderStatus } from "../../types/DeliveryOrderTypeDto";
import MapWithDirections from "./MapWithDirections";
import Footer from "../../../components/Footer";
import GetBack from "../../../components/GetBack";
import { useAuth } from "../../Login/context/useAuth";

type RouteProps = RouteProp<DeliveryStackParamList, "OrdersRouteMap">;
type NavProps = NativeStackNavigationProp<DeliveryStackParamList>;

export default function OrdersRouteMapPage() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavProps>();
  const { orders: initialOrders } = route.params;
  const { name } = useAuth();

  const [orders, setOrders] = useState<LogisticOrder[]>(initialOrders || []);
  const [isExpanded, setIsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(1));

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (!initialOrders?.length) {
      setModalMessage("No hay pedidos para mostrar en el mapa.");
      setModalVisible(true);
      setTimeout(() => navigation.goBack(), 2000);
      return;
    }

    const allOnWay = initialOrders.every(
      (o: LogisticOrder) => o.status === OrderStatus.OnTheWay
    );

    if (!allOnWay) {
      setModalMessage(
        "Solo puedes ver la ruta cuando todos los pedidos estén 'En Camino'."
      );
      setModalVisible(true);
      setTimeout(() => navigation.goBack(), 2500);
    }
  }, [initialOrders]);

  const toggleExpand = () => {
    Animated.timing(animation, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsExpanded(!isExpanded);
  };

  // Manejo de entregado / incidente
  const handleConfirmDelivery = (orderId: number, delivered: boolean) => {
    // Animación de fade out para feedback visual
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    const newOrders = orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            status: delivered
              ? OrderStatus.Delivered
              : OrderStatus.WithIncidents,
          }
        : o
    );

    // Filtramos los OnTheWay para el mapa
    const filteredOrders = newOrders.filter(
      (o) => o.status === OrderStatus.OnTheWay
    );

    setOrders(filteredOrders);

    // Mensaje del modal
    const message = delivered
      ? `✅ El pedido #${orderId} ahora se encuentra en el listado de pedidos entregados.`
      : `⚠️ El pedido #${orderId} ahora se encuentra en el listado de pedidos con incidentes.`;

    setModalMessage(message);
    setModalVisible(true);
  };

  const bottomHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [150, 520],
  });

  return (
    <View style={styles.container}>
      <MapWithDirections orders={orders} />

      {/* Header con gradiente y sombra mejorada */}
      <View style={styles.headerContainer}>
        <View style={styles.headerGradient}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <View style={{}}>
              <GetBack />
            </View>
          </TouchableOpacity>
          <View style={styles.routeInfoContainer}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconEmoji}>🚚</Text>
              </View>
              <View>
                <Text style={styles.headerText}>Ruta de {name}</Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>DELIVERY</Text>
                </View>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{orders.length}</Text>
                <Text style={styles.statLabel}>Entregas</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>En curso</Text>
                <Text style={styles.statLabel}>Estado</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom sheet mejorado */}
      <Animated.View style={[styles.bottomSheet, { height: bottomHeight }]}>
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>
        
        <TouchableOpacity onPress={toggleExpand} style={styles.toggleButton}>
          <Text style={styles.toggleButtonText}>
            {isExpanded ? "Ocultar detalles" : "Ver detalles de entregas"}
          </Text>
          <Text style={styles.toggleIcon}>{isExpanded ? "▼" : "▲"}</Text>
        </TouchableOpacity>

        {isExpanded && (
          <ScrollView 
            style={styles.ordersList}
            showsVerticalScrollIndicator={false}
          >
            {orders.map((order, index) => (
              <Animated.View 
                key={order.id} 
                style={[styles.orderCard, { opacity: fadeAnim }]}
              >
                <View style={styles.orderHeader}>
                  <View style={styles.orderNumberBadge}>
                    <Text style={styles.orderNumber}>#{index + 1}</Text>
                  </View>
                  <View style={styles.orderInfo}>
                    <Text style={styles.orderTitle}>
                      {typeof order.customer === "string"
                        ? order.customer
                        : `${order.customer.firstName} ${order.customer.lastName}`}
                    </Text>
                    <View style={styles.addressRow}>
                      <Text style={styles.addressIcon}>📍</Text>
                      <Text style={styles.addressText}>
                        {`${order.deliveryAddress.street} ${order.deliveryAddress.number}${
                          order.deliveryAddress.apartment
                            ? ", " + order.deliveryAddress.apartment
                            : ""
                        }, ${order.deliveryAddress.city}`}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.buttonsRow}>
                  <TouchableOpacity
                    style={[styles.button, styles.deliveredButton]}
                    onPress={() => handleConfirmDelivery(order.id, true)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.buttonIcon}>✓</Text>
                    <Text style={styles.buttonText}>Entregado</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.incidentButton]}
                    onPress={() => handleConfirmDelivery(order.id, false)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.buttonIcon}>⚠</Text>
                    <Text style={styles.buttonText}>Incidente</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))}
            <View style={styles.bottomPadding} />
          </ScrollView>
        )}
      </Animated.View>

      {/* Modal mejorado */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={styles.modalContainer}>
            <View style={styles.modalIconContainer}>
              <Text style={styles.modalIcon}>
                {modalMessage.includes("✅") ? "✅" : modalMessage.includes("⚠️") ? "⚠️" : "ℹ️"}
              </Text>
            </View>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.9}
            >
              <Text style={styles.modalButtonText}>Aceptar</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  
  // Header mejorado
  headerContainer: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  headerGradient: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.1)",
  },
  backButton: { 
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  routeInfoContainer: {},
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#dbeafe",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconEmoji: {
    fontSize: 24,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  roleBadge: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  roleText: {
    fontSize: 11,
    color: "#ffffff",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "space-around",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3b82f6",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#e2e8f0",
  },

  // Bottom sheet mejorado
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: 8,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#cbd5e1",
    borderRadius: 2,
  },
  toggleButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    gap: 8,
  },
  toggleButtonText: {
    color: "#3b82f6",
    fontWeight: "600",
    fontSize: 15,
  },
  toggleIcon: {
    color: "#3b82f6",
    fontSize: 14,
    fontWeight: "bold",
  },
  
  // Lista de órdenes mejorada
  ordersList: { 
    marginTop: 12,
    flex: 1,
  },
  orderCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    marginBottom: 14,
  },
  orderNumberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#dbeafe",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3b82f6",
  },
  orderInfo: {
    flex: 1,
  },
  orderTitle: { 
    fontWeight: "700", 
    fontSize: 16, 
    color: "#0f172a",
    marginBottom: 6,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  addressIcon: {
    fontSize: 14,
    marginTop: 2,
  },
  addressText: { 
    fontSize: 13, 
    color: "#64748b",
    flex: 1,
    lineHeight: 18,
  },
  buttonsRow: { 
    flexDirection: "row", 
    gap: 10,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  deliveredButton: { 
    backgroundColor: "#10b981",
  },
  incidentButton: { 
    backgroundColor: "#ef4444",
  },
  buttonIcon: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "700", 
    fontSize: 13,
    letterSpacing: 0.3,
  },
  bottomPadding: {
    height: 20,
  },

  // Modal mejorado
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 28,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#f0f9ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  modalIcon: {
    fontSize: 32,
  },
  modalText: {
    fontSize: 15,
    color: "#334155",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.5,
  },
});