import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MapPin, Truck, AlertTriangle } from "lucide-react-native";
import { useMyOnTheWayOrders } from "../../hocks/useOrdersToOnTheWay";
import { useGetMyOrdersWithIncident } from "../../hocks/useOrdersWithIncidentes";
import { DeliveryStackParamList } from "../../types/DeliveryStackType";
import GetBack from "../../../components/GetBack";
import { useAuth } from "../../Login/context/useAuth"; // ⚠️ ajusta el path según donde tengas el context
import NavbarDelivery from "../../components/Navbar/NavbarDelivery";


type DeliveryNavigationProp = NativeStackNavigationProp<DeliveryStackParamList>;

export default function OrdersMapPage() {
  const navigation = useNavigation<DeliveryNavigationProp>();
  const { userId, name, role, isAuthenticated, logout, team } = useAuth();

  if (!isAuthenticated || !userId || !name || !role) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Debes iniciar sesión para ver los pedidos entregados.</Text>
      </View>
    );
  }
  
  const teamName = typeof team === "object" ? team?.teamName : team;

  const user = {
    name: name ?? "",
    role: role ?? "",
    team: teamName ?? null,
  };

  const { orders: onTheWayOrders, loading: loadingWay } =
    useMyOnTheWayOrders(userId || "");
  const {
    orders: incidentOrders,
    loading: loadingIncident,
    refetch: refetchIncident,
  } = useGetMyOrdersWithIncident(userId || "");

  const [showType, setShowType] = useState<"onTheWay" | "incidents" | null>(null);
  const [markers, setMarkers] = useState<
    { id: number; latitude: number; longitude: number; address: string }[]
  >([]);

  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    let source =
      showType === "onTheWay"
        ? onTheWayOrders
        : showType === "incidents"
        ? incidentOrders
        : [];

    if (source && source.length > 0) {
      const mapped = source
        .filter(
          (o) =>
            o.deliveryAddress &&
            o.deliveryAddress.latitude &&
            o.deliveryAddress.longitude
        )
        .map((o) => ({
          id: o.id,
          latitude: Number(o.deliveryAddress.latitude),
          longitude: Number(o.deliveryAddress.longitude),
          address: o.deliveryAddress.formattedAddress ?? "Sin dirección",
        }));

      setMarkers(mapped);
    } else {
      setMarkers([]);
    }
  }, [showType, onTheWayOrders, incidentOrders, userId, isAuthenticated]);

  const isLoading =
    loadingWay || loadingIncident || (showType && markers.length === 0);

  if (!isAuthenticated) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>⚠️ Debes iniciar sesión para ver el mapa.</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login" as never)}
        >
          <Text style={styles.loginButtonText}>Ir al login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NavbarDelivery user={user} isAuthenticated={isAuthenticated} logout={logout} />
      
      {/* 🔙 Header */}
      <View style={styles.header}>
        <GetBack />
        <Text style={styles.title}>Mapa de Pedidos</Text>
      </View>

      {/* 🟢🔴 Botones */}
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

      {/* 🗺️ Mapa */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Cargando pedidos...</Text>
        </View>
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: -31.4201,
            longitude: -64.1888,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          {/* Marcadores dinámicos (pedidos) */}
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              title={`Pedido #${marker.id}`}
              description={marker.address}
              pinColor={showType === "onTheWay" ? "#3B82F6" : "#EF4444"}
            />
          ))}

          {/* 📍 Punto fijo: Distribuidora Verona */}
          <Marker
            coordinate={{
              latitude: -31.4102743595129,
              longitude: -64.1787510151854,
            }}
            title="Distribuidora Verona"
            description="Punto de salida"
          >
            {/* 👇 Icono personalizado */}
            <View
              style={{
                backgroundColor: "#fff",
                padding: 6,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: "#22C55E",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOpacity: 0.25,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 3,
                elevation: 4,
              }}
            >
              <MapPin size={20} color="#22C55E" />
            </View>
          </Marker>

        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F9FAFB" 
  },
  
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1F2937",
    marginLeft: 12,
    letterSpacing: -0.5,
    textShadowColor: "rgba(0, 0, 0, 0.05)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 140,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  buttonActiveOnWay: {
    backgroundColor: "#3B82F6",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  
  buttonActiveIncident: {
    backgroundColor: "#EF4444",
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  
  buttonText: { 
    color: "#fff", 
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.3,
  },
  
  map: { 
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  
  loadingText: { 
    marginTop: 12, 
    color: "#6B7280",
    fontSize: 15,
    fontWeight: "500",
  },
  
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 24,
  },
  
  errorText: { 
    fontSize: 16, 
    color: "#DC2626", 
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "600",
  },
  
  loginButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  
  loginButtonText: { 
    color: "#fff", 
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});