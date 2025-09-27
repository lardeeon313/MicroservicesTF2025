import React from "react";
import { View } from "react-native";
import NavbarDelivery from "../../components/Navbar/NavbarDelivery";
import DeliveryDashboardComponent from "../../navigation/DeliveryDashboard";
import { useAuth } from "../../Login/context/useAuth"; // 👈 Importa el hook de tu AuthProvider

const DeliveryDashboardPage = () => {
  const { name, role, isAuthenticated, logout } = useAuth();

  // Armamos el objeto `user` en base a los datos del AuthContext
  const user = name && role ? { name, role } : null;

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <NavbarDelivery 
        user={user}
        isAuthenticated={isAuthenticated}
        logout={logout}
      />
      <DeliveryDashboardComponent />
    </View>
  );
};

export default DeliveryDashboardPage;

