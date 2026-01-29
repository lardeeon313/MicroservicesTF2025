import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Truck, AlertTriangle } from "lucide-react-native";

import { useMyOnTheWayOrders } from "../../hocks/useOrdersToOnTheWay";
import { useGetMyOrdersWithIncident } from "../../hocks/useOrdersWithIncidentes";
import { DeliveryStackParamList } from "../../types/DeliveryStackType";
import GetBack from "../../../components/GetBack";
import { useAuth } from "../../Login/context/useAuth";
import NavbarDelivery from "../../components/Navbar/NavbarDelivery";
import { Dimensions } from "react-native";

/* =========================
   TIPOS
========================= */

type DeliveryNavigationProp =
  NativeStackNavigationProp<DeliveryStackParamList>;

type MarkerType = {
  id: number;
  latitude: number;
  longitude: number;
  address: string;
};

/* =========================
   MAPAS
   ⚠️ IMPORTANTE:
   NO importar react-native-maps arriba
========================= */

function NativeMap({ markers }: { markers: MarkerType[] }) {
  const MapView = require("react-native-maps").default;
  const { Marker } = require("react-native-maps");

  return (
    <MapView style={{ flex: 1 }}>
      {markers.map((m) => (
        <Marker
          key={m.id}
          coordinate={{
            latitude: m.latitude,
            longitude: m.longitude,
          }}
        />
      ))}
    </MapView>
  );
}

function WebMap({ markers }: { markers: MarkerType[] }) {
  if (!markers.length) return null;

  const { latitude, longitude } = markers[0];

  return (
    <iframe
      width="100%"
      height="100%"
      style={{ border: 0 }}
      loading="lazy"
      src={`https://www.google.com/maps?q=${latitude},${longitude}&z=14&output=embed`}
    />
  );
}

const WINDOW_HEIGHT = Dimensions.get("window").height;
/* =========================
   PAGE
========================= */

export default function OrdersMapPage() {
  const navigation = useNavigation<DeliveryNavigationProp>();
  const { userId, name, role, isAuthenticated, logout, team } = useAuth();

  if (!isAuthenticated || !userId || !name || !role) {
    return (
      <View style={styles.center}>
        <Text>Debes iniciar sesión para ver los pedidos.</Text>
      </View>
    );
  }

  const teamName = typeof team === "object" ? team?.teamName : team;

  const user = {
    name,
    role,
    team: teamName ?? null,
  };

  const { orders: onTheWayOrders, loading: loadingWay } =
    useMyOnTheWayOrders(userId);

  const {
    orders: incidentOrders,
    loading: loadingIncident,
    refetch: refetchIncident,
  } = useGetMyOrdersWithIncident(userId);

  const [showType, setShowType] =
    useState<"onTheWay" | "incidents" | null>(null);

  const [markers, setMarkers] = useState<MarkerType[]>([]);

  useEffect(() => {
    const source =
      showType === "onTheWay"
        ? onTheWayOrders
        : showType === "incidents"
        ? incidentOrders
        : [];

    if (source?.length) {
      setMarkers(
        source
          .filter(
            (o) =>
              o.deliveryAddress?.latitude &&
              o.deliveryAddress?.longitude
          )
          .map((o) => ({
            id: o.id,
            latitude: Number(o.deliveryAddress.latitude),
            longitude: Number(o.deliveryAddress.longitude),
            address:
              o.deliveryAddress.formattedAddress ?? "Sin dirección",
          }))
      );
    } else {
      setMarkers([]);
    }
  }, [showType, onTheWayOrders, incidentOrders]);

  const isLoading =
    loadingWay || loadingIncident || (showType && markers.length === 0);

  return (
    <View style={styles.container}>
      <NavbarDelivery
        user={user}
        isAuthenticated={isAuthenticated}
        logout={logout}
      />

      <View style={styles.header}>
        <GetBack />
        <Text style={styles.title}>Mapa de Pedidos</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            showType === "onTheWay" && styles.buttonActiveOnWay,
          ]}
          onPress={() => setShowType("onTheWay")}
        >
          <Truck size={18} color="#fff" />
          <Text style={styles.buttonText}>En Camino</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            showType === "incidents" && styles.buttonActiveIncident,
          ]}
          onPress={() => {
            setShowType("incidents");
            refetchIncident();
          }}
        >
          <AlertTriangle size={18} color="#fff" />
          <Text style={styles.buttonText}>Incidentes</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Cargando pedidos...</Text>
        </View>
      ) : (
        <View style={styles.map}>
          {Platform.OS === "web" ? (
            <WebMap markers={markers} />
          ) : (
            <NativeMap markers={markers} />
          )}
        </View>
      )}
    </View>
  );
}

/* =========================
   STYLES
========================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1F2937",
    marginLeft: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginVertical: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonActiveOnWay: { backgroundColor: "#3B82F6" },
  buttonActiveIncident: { backgroundColor: "#EF4444" },
  buttonText: { color: "#fff", fontWeight: "700" },
  map: {
    flex: 1,
    minHeight: Platform.OS === "web" ? 600 : "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { marginTop: 12, color: "#6B7280" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
