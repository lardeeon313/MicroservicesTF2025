import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { MapPin, CheckCircle, AlertTriangle , CircleDollarSign} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DeliveryStackParamList } from "../types/DeliveryStackType";
import NavbarDelivery from "../components/Navbar/NavbarDelivery";
import Footer from "../../components/Footer";

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
    title: "Pedidos entregados",
    description: "Consulta todos los pedidos que ya han sido entregados.",
    icon: CheckCircle,
    path: "OrdersToDelivered",
  },
  {
    title: "Pedidos con incidentes",
    description:
      "Revisa todos los pedidos que hayan tenido incidentes durante el trayecto o después del mismo.",
    icon: AlertTriangle,
    path: "OrdersToIncidents",
  },
  {
    title: "Pedidos Verificados",
    description: "Revisa los pedidos que ya han sido verificados por tesoreria para completar el proceso.",
    icon: CircleDollarSign,
    path: "OrdersToVerified",
  }
];

const DeliveryDashboardComponent = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<DeliveryStackParamList>>();
  const numColumns = 2;
  const cardWidth = Dimensions.get("window").width / numColumns - 24;

  const mockUser = {
    name: "Carlos",
    role: "Repartidor",
    team: { teamName: "Zona Oeste" },
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      {/* 👇 Navbar arriba */}
      <NavbarDelivery
        user={mockUser}
        isAuthenticated={true}
        logout={() => console.log("🚪 Sesión cerrada")}
      />

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
        ¡Bienvenido {mockUser.name}!
      </Text>

      {/* 👇 Cards abajo */}
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
                // ✅ Usamos switch/case para evitar problemas de tipo
                switch (card.path) {
                  case "OrdersToDistribute":
                    navigation.navigate("OrdersToDistribute");
                    break;
                  case "OrdersToDelivered":
                    navigation.navigate("OrdersToDelivered");
                    break;
                  case "OrdersToIncidents":
                    navigation.navigate("OrdersToIncidents");
                    break;
                  case "OrdersToVerified":
                    navigation.navigate("OrdersToVerified");
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
              <Text
                style={{
                  fontSize: 12,
                  color: "#6B7280",
                  textAlign: "center",
                }}
              >
                {card.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <Footer />
    </View>
  );
};

export default DeliveryDashboardComponent;
