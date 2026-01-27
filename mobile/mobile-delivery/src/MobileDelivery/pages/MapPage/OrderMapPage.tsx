import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MapPin, Package, AlertCircle } from "lucide-react-native";
import { DeliveryStackParamList } from "../../types/DeliveryStackType";
import { useOrderById } from "../../hocks/useOneOrderDetail";
import GetBack from "../../../components/GetBack";
import NavbarDelivery from "../../components/Navbar/NavbarDelivery";

/* =========================================
   CARGA SEGURA DEL MAPA (NO ROMPE WEB)
========================================= */
let MapView: any = null;
let Marker: any = null;

if (Platform.OS !== "web") {
  const Maps = require("react-native-maps");
  MapView = Maps.default;
  Marker = Maps.Marker;
}

/* =========================================
   TYPES
========================================= */
type OrderMapRouteProp = {
  orderId: number;
};

type DeliveryNavigationProp =
  NativeStackNavigationProp<DeliveryStackParamList>;

export default function OrderMapPage() {
  const route = useRoute();
  const navigation = useNavigation<DeliveryNavigationProp>();
  const { orderId } = route.params as OrderMapRouteProp;

  const { order, loading, error } = useOrderById(orderId);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );

  useEffect(() => {
    if (order?.deliveryAddress) {
      const lat = Number(order.deliveryAddress.latitude);
      const lng = Number(order.deliveryAddress.longitude);

      if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
        setCoords({ lat, lng });
      } else {
        setCoords({ lat: -31.4201, lng: -64.1888 }); // Córdoba fallback
      }
    }
  }, [order]);

  /* =========================================
     STATES
  ========================================= */

  if (loading) {
    return (
      <View style={styles.center}>
        <View style={styles.loadingContainer}>
          <Package size={48} color="#3B82F6" />
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Cargando pedido...</Text>
        </View>
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={styles.center}>
        <View style={styles.errorContainer}>
          <AlertCircle size={64} color="#EF4444" />
          <Text style={styles.errorText}>
            {error || "No se pudo cargar el pedido."}
          </Text>
          <GetBack />
        </View>
      </View>
    );
  }

  if (!coords) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Cargando mapa...</Text>
      </View>
    );
  }

  /* =========================================
     RENDER
  ========================================= */

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <GetBack />

        <View style={styles.titleContainer}>
          <View style={styles.iconBadge}>
            <Package size={20} color="#3B82F6" />
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
          <MapPin size={16} color="#3B82F6" />
          <Text style={styles.locationText}>Ubicación</Text>
        </View>
      </View>

      {/* ================= MAPA ================= */}
      {Platform.OS === "web" ? (
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          src={`https://www.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`}
        />
      ) : (
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
            coordinate={{
              latitude: coords.lat,
              longitude: coords.lng,
            }}
            title={`Pedido #${order.id}`}
            description={order.deliveryAddress.formattedAddress ?? ""}
          />
        </MapView>
      )}

      <View style={styles.addressCard}>
        <View style={styles.addressHeader}>
          <MapPin size={20} color="#3B82F6" />
          <Text style={styles.addressTitle}>Dirección de entrega</Text>
        </View>
        <Text style={styles.addressText}>
          {order.deliveryAddress.formattedAddress ?? "Sin dirección"}
        </Text>
      </View>
    </View>
  );
}

/* =========================================
   STYLES (LOS TUYOS, SIN CAMBIOS)
========================================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  titleContainer: { flexDirection: "row", gap: 12, marginBottom: 12 },
  iconBadge: {
    backgroundColor: "#EFF6FF",
    padding: 10,
    borderRadius: 12,
  },
  titleTextContainer: { flex: 1 },
  title: { fontSize: 22, fontWeight: "700" },
  customerRow: { flexDirection: "row", gap: 6 },
  customerLabel: { fontSize: 13, color: "#9CA3AF" },
  customerName: { fontSize: 15, fontWeight: "600" },
  locationBadge: {
    flexDirection: "row",
    gap: 6,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  locationText: { fontSize: 12, fontWeight: "600", color: "#3B82F6" },
  map: { flex: 1 },
  addressCard: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    elevation: 8,
  },
  addressHeader: { flexDirection: "row", gap: 8, marginBottom: 8 },
  addressTitle: { fontSize: 14, fontWeight: "700" },
  addressText: { fontSize: 16, color: "#6B7280" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingContainer: { alignItems: "center", gap: 16 },
  loadingText: { fontSize: 16, color: "#6B7280" },
  errorContainer: { alignItems: "center", gap: 20 },
  errorText: { fontSize: 18, color: "#EF4444", textAlign: "center" },
});
