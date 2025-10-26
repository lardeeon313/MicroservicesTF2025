import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DeliveryStackParamList } from "../../types/DeliveryStackType";
import MapWithDirections from "./MapWithDirections";
import GetBack from "../../../components/GetBack";
import Footer from "../../../components/Footer";

type RouteProps = RouteProp<DeliveryStackParamList, "OneOrderRouteMap">;
type NavProps = NativeStackNavigationProp<DeliveryStackParamList>;

export default function OneOrderRouteMapPage() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavProps>();
  const { order } = route.params;

  const getPriorityColor = (priority: string) => {
    switch(priority?.toLowerCase()) {
      case 'alta': return '#ef4444';
      case 'media': return '#f59e0b';
      case 'baja': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'pendiente': return '#f59e0b';
      case 'en camino': return '#3b82f6';
      case 'entregado': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <GetBack />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pedido #{order.id}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info del Cliente */}
        <View style={styles.clientCard}>
          <View style={styles.clientHeader}>
            <Text style={styles.clientIcon}>👤</Text>
            <View style={styles.clientInfo}>
              <Text style={styles.clientLabel}>Cliente</Text>
              <Text style={styles.clientName}>{order.customer.firstName} {order.customer.lastName}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>📍</Text>
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Dirección</Text>
                <Text style={styles.detailValue}>{order.customer.address}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>💳</Text>
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Método de pago</Text>
                <Text style={styles.detailValue}>{order.paymentType}</Text>
              </View>
            </View>

            <View style={styles.statusContainer}>
              <View style={styles.statusBadge}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(order.status) }]} />
                <Text style={styles.statusText}>{order.status}</Text>
              </View>

              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(order.priority) + '15' }]}>
                <Text style={[styles.priorityText, { color: getPriorityColor(order.priority) }]}>
                  {order.priority}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Mapa */}
        <View style={styles.mapContainer}>
          <Text style={styles.mapTitle}>Ruta de entrega</Text>
          <View style={styles.mapWrapper}>
            <MapWithDirections orders={[order]} />
          </View>
        </View>
      </ScrollView>
      <Footer/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#374151",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "700",
    marginLeft: 12,
  },
  content: {
    flex: 1,
  },
  clientCard: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  clientHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  clientIcon: {
    fontSize: 48,
    marginRight: 16,
  },
  clientInfo: {
    flex: 1,
  },
  clientLabel: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  clientName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginBottom: 16,
  },
  detailsContainer: {
    gap: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  detailIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  detailValue: {
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "500",
    lineHeight: 22,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  priorityBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  priorityText: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  mapContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 12,
    marginLeft: 4,
  },
  mapWrapper: {
    height: 400,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
});