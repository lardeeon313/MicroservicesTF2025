import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { MapPin, CheckCircle, AlertTriangle, Bus,Search  } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DeliveryStackParamList } from "../types/DeliveryStackType";
import { useAuth } from "../Login/context/useAuth";
import NavbarDelivery from "../components/Navbar/NavbarDelivery";
import Footer from "../../components/Footer";
import { OrdersSearchModal } from "../pages/OrderFindedPage/OrderFindedPage";



type CardItem = {
  title: string;
  description: string;
  icon: React.ElementType;
  path: keyof DeliveryStackParamList;
};

const cards: CardItem[] = [
  {
    title: "Pedidos para repartir",
    description:
      "Visualiza todos los pedidos que ya has confirmado dependiendo de tu zona.",
    icon: MapPin,
    path: "OrdersToDistribute",
  },
  {
    title: "Pedidos en \ncamino",
    description:
      "Revisa los pedidos que ya confirmaste y que se encuentran en camino.",
    icon: Bus,
    path: "OrdersOnTheWay",
  },
  {
    title: "Pedidos con incidentes",
    description:
      "Revisa todos los pedidos que hayan tenido incidentes durante el trayecto o después del mismo.",
    icon: AlertTriangle,
    path: "OrdersToIncidents",
  },
  {
    title: "Pedidos entregados",
    description: "Consulta todos los pedidos que ya han sido entregados.",
    icon: CheckCircle,
    path: "OrdersToDelivered",
  },
];

const DeliveryDashboardComponent = () => {
  const navigation = useNavigation<NativeStackNavigationProp<DeliveryStackParamList>>();
  const { userId, name, role, team, loading: authLoading, token, isAuthenticated, logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // 🔄 Forzar recarga si cambia usuario o token
  useEffect(() => {
    if (userId && token) {
      setReloadKey((prev) => prev + 1);
    }
  }, [userId, token]);

  if (authLoading) {
    return <Text style={{ textAlign: "center", marginTop: 50 }}>Cargando sesión...</Text>;
  }

  if (!userId || !token) {
    return <Text style={{ textAlign: "center", marginTop: 50 }}>Error: No hay sesión activa</Text>;
  }

  if (!isAuthenticated || !userId || !name || !role) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Debes iniciar sesión para ver los pedidos con faltantes.</Text>
      </View>
    );
  }
  console.log("TEAM DESDE AUTH:", team);

  const teamName = typeof team === "object" ? team?.teamName : team;

  const user = {
    name: name ?? "",
    role: role ?? "",
    team: teamName ?? null,
  };

  const numColumns = 2;
  const cardWidth = Dimensions.get("window").width / numColumns - 24;

  console.log("EL USUARIO " ,user)

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }} key={reloadKey}>
      {/* Navbar */}
      <NavbarDelivery user={user} isAuthenticated={isAuthenticated} logout={logout} />

      {/* Modal */}
      <OrdersSearchModal visible={modalVisible} onClose={() => setModalVisible(false)} />

      {/* Bienvenida */}
      <Text
        style={{
          fontSize: 24,
          fontWeight: "800",
          marginBottom: 32,
          color: "#8b0000",
          letterSpacing: 0.5,
          lineHeight: 32,
          textAlign: "center",
          textShadowColor: "rgba(0,0,0,0.1)",
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 2,
          marginTop: 25,
        }}
      >
        ¡Bienvenido {user.name}!
      </Text>


      {/* Botón para abrir modal */}
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          backgroundColor: '#ffffffff',
          borderRadius: 12,
          marginHorizontal: 16,
          marginBottom: 16,
          shadowColor: '#520404ff',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.50,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Search 
          color="#111111ff" 
          size={20} 
          strokeWidth={2.5}
          style={{ marginRight: 8 }}
        />
        <Text 
          style={{ 
            color: '#5a5a5aff', 
            fontWeight: 'bold', 
            fontSize: 16,
            letterSpacing: 0.3
          }}
        >
          Buscar pedidos por su estado
        </Text>
      </TouchableOpacity>

      {/* 📦 Cards dinámicas */}
      <View style={{ flex: 1, padding: 16 }}>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {cards.map((card, index) => (
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                width: cardWidth,
                padding: 16,
                marginBottom: 16,
                alignItems: "center",
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 10,
                elevation: 3,
              }}
              onPress={() => {
                switch (card.path) {
                  case "OrdersToDistribute":
                    navigation.navigate("OrdersToDistribute");
                    break;
                  case "OrdersOnTheWay":
                    navigation.navigate("OrdersOnTheWay");
                    break;
                  case "OrdersToIncidents":
                    navigation.navigate("OrdersToIncidents");
                    break;
                  case "OrdersToDelivered":
                    navigation.navigate("OrdersToDelivered");
                    break;
                  default:
                    console.warn("Ruta no reconocida:", card.path);
                }
              }}
            >
              <card.icon size={32} color="#8b0000" style={{ marginBottom: 8 }} />
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: "#111827",
                  textAlign: "center",
                  marginBottom: 6,
                }}
              >
                {card.title}
              </Text>
              <Text style={{ fontSize: 12, color: "#6B7280", textAlign: "center" }}>
                {card.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Footer */}
      <Footer />
    </View>
  );
};

export default DeliveryDashboardComponent;
