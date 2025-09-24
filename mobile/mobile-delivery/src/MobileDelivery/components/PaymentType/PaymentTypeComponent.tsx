import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialIcons } from "@expo/vector-icons"; 
import { PaymentType } from "../../types/PaymentType";
import { DeliveryStackParamList } from "../../types/DeliveryStackType";
import GetBack from "../../../components/GetBack";
import Footer from "../../../components/Footer";
import NavbarDelivery from "../Navbar/NavbarDelivery";

type SelectPaymentRouteProp = RouteProp<
  DeliveryStackParamList,
  "SelectPaymentType"
>;
type NavigationProp = NativeStackNavigationProp<DeliveryStackParamList>;

export default function PaymentTypeComponent() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<SelectPaymentRouteProp>();
  const { orderId } = route.params;

  const handleSelect = (type: PaymentType) => {
    console.log(`Pedido ${orderId} pagado con: ${type}`);
    navigation.goBack();
  };

  const mockUser = {
    name: "Carlos",
    role: "Repartidor",
    team: { teamName: "Zona Oeste" },
  };

  const handleLogout = () => console.log("🚪 Sesión cerrada");

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* NAVBAR */}
      <NavbarDelivery
        user={mockUser}
        isAuthenticated={true}
        logout={handleLogout}
      />

      {/* BOTÓN VOLVER */}
      <View style={{ marginTop: 10, marginLeft: 10 }}>
        <GetBack />
      </View>

      {/* CONTENIDO CENTRAL */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
          backgroundColor: "#fff",
        }}
      >
        <Text
          style={{
            fontSize: 22,
            marginBottom: 24,
            fontWeight: "bold",
            color: "#222",
            textAlign: "center",
          }}
        >
          Seleccionar Tipo de Pago
        </Text>

        {/* ✅ CONTENEDOR DE BOTONES (sin flex:1) */}
        <View style={{ width: "100%" }}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#4CAF50" }]}
            onPress={() => handleSelect("CASH")}
          >
            <MaterialIcons
              name="attach-money"
              size={22}
              color="#fff"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.text}>Efectivo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#2196F3" }]}
            onPress={() => handleSelect("CURRENT_ACCOUNT")}
          >
            <MaterialIcons
              name="account-balance"
              size={22}
              color="#fff"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.text}>Cuenta Corriente</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#FF9800" }]}
            onPress={() => handleSelect("TRANSFER")}
          >
            <MaterialIcons
              name="swap-horiz"
              size={22}
              color="#fff"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.text}>Transferencia</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#333" }]}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons
              name="cancel"
              size={22}
              color="#fff"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.text}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* FOOTER */}
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%", // ocupa todo el ancho
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2, // sombra en Android
  },
  text: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    marginLeft: 8,
  },
});
