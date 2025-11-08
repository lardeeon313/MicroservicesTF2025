import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Text, StatusBar } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MapPin, Package, AlertCircle } from "lucide-react-native";
import { DeliveryStackParamList } from "../../types/DeliveryStackType";
import { useOrderById } from "../../hocks/useOneOrderDetail";
import GetBack from "../../../components/GetBack";
import NavbarDelivery from "../../components/Navbar/NavbarDelivery";

type OrderMapRouteProp = {
  orderId: number;
};

type DeliveryNavigationProp = NativeStackNavigationProp<DeliveryStackParamList>;

export default function OrderMapPage() {
  const route = useRoute();
  const navigation = useNavigation<DeliveryNavigationProp>();
  const { orderId } = route.params as OrderMapRouteProp;
  const { order, loading, error } = useOrderById(orderId);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (order && order.deliveryAddress) {
      const lat = Number(order.deliveryAddress.latitude);
      const lng = Number(order.deliveryAddress.longitude);

      if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
        console.log("✅ Coordenadas del backend:", lat, lng);
        setCoords({ lat, lng });
      } else {
        console.warn("⚠️ Coordenadas inválidas, usando fallback Córdoba Capital");
        setCoords({ lat: -31.4201, lng: -64.1888 });
      }
    }
  }, [order]);

  if (loading) {
    return (
      <View style={styles.center}>
        <View style={styles.loadingContainer}>
          <Package size={48} color="#3B82F6" strokeWidth={2} />
          <ActivityIndicator size="large" color="#3B82F6" style={styles.loader} />
          <Text style={styles.loadingText}>Cargando pedido...</Text>
        </View>
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={styles.center}>
        <View style={styles.errorContainer}>
          <AlertCircle size={64} color="#EF4444" strokeWidth={2} />
          <Text style={styles.errorText}>{error || "No se pudo cargar el pedido."}</Text>
          <View style={styles.backButtonWrapper}>
            <GetBack />
          </View>
        </View>
      </View>
    );
  }

  if (!coords) {
    return (
      <View style={styles.center}>
        <View style={styles.loadingContainer}>
          <MapPin size={48} color="#3B82F6" strokeWidth={2} />
          <ActivityIndicator size="large" color="#3B82F6" style={styles.loader} />
          <Text style={styles.loadingText}>Cargando mapa...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <View style={styles.backButton}>
          <GetBack />
        </View>
        
        <View style={styles.titleContainer}>
          <View style={styles.iconBadge}>
            <Package size={20} color="#3B82F6" strokeWidth={2.5} />
          </View>
          <View style={styles.titleTextContainer}>
            <Text style={styles.title}>Pedido #{order.id}</Text>
            <View style={styles.customerRow}>
              <Text style={styles.customerLabel}>Cliente:</Text>
              <Text style={styles.customerName}>
                {order.customer.firstName} {order.customer.lastName}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.locationBadge}>
          <MapPin size={16} color="#3B82F6" strokeWidth={2.5} />
          <Text style={styles.locationText}>Ubicación</Text>
        </View>
      </View>

      <MapView
        style={styles.map}
        region={{
          latitude: coords.lat,
          longitude: coords.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude: coords.lat, longitude: coords.lng }}
          title={`Pedido #${order.id}`}
          description={order.deliveryAddress.formattedAddress ?? ""}
        />
      </MapView>

      <View style={styles.addressCard}>
        <View style={styles.addressHeader}>
          <MapPin size={20} color="#3B82F6" strokeWidth={2.5} />
          <Text style={styles.addressTitle}>Dirección de entrega</Text>
        </View>
        <Text style={styles.addressText}>
          {order.deliveryAddress.formattedAddress ?? "Sin dirección"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  iconBadge: {
    backgroundColor: "#EFF6FF",
    padding: 10,
    borderRadius: 12,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  titleTextContainer: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: -0.5,
  },
  customerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  customerLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  customerName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4B5563",
  },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  locationText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3B82F6",
  },
  map: {
    flex: 1,
  },
  addressCard: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  addressText: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 22,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    alignItems: "center",
    gap: 16,
  },
  loader: {
    marginTop: 8,
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  errorContainer: {
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 18,
    color: "#EF4444",
    textAlign: "center",
    fontWeight: "600",
  },
  backButtonWrapper: {
    marginTop: 12,
  },
});