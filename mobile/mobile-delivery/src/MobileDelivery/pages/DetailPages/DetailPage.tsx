import React from "react";
import { View, StyleSheet, ScrollView } from "react-native"; // ✅ View correcto
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DeliveryStackParamList } from "../../types/DeliveryStackType";
import DetailOrderComponent from "../../components/Detail/DetailOrder";
import NavbarDelivery from "../../components/Navbar/NavbarDelivery";
import Footer from "../../../components/Footer";
import GetBack from "../../../components/GetBack";

type OrderDetailRouteProp = RouteProp<DeliveryStackParamList, "OrderDetail">;
type OrderDetailNavigationProp = NativeStackNavigationProp<DeliveryStackParamList>;

export default function OrderDetailPage() {
  const route = useRoute<OrderDetailRouteProp>();
  const navigation = useNavigation<OrderDetailNavigationProp>();
  const { order } = route.params;

  const mockUser = {
    name: "Carlos",
    role: "Repartidor",
    team: { teamName: "Zona Oeste" },
  };

  const handleLogout = () => console.log("🚪 Sesión cerrada");

  return (
    <View style={styles.container}>
      <NavbarDelivery user={mockUser} isAuthenticated={true} logout={handleLogout} />

      <View style={{ marginTop: 10, marginLeft: 10 }}>
        <GetBack/>
      </View>
      {/* ScrollView para evitar cortes en pantallas chicas */}
      <ScrollView contentContainerStyle={styles.content}>
        <DetailOrderComponent
          order={order}
          onBack={() => navigation.goBack()}
        />
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});


//{ marginTop: 10, marginLeft: 10 },