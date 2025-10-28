import React from "react";
import { View,Text } from "react-native";
import NavbarDelivery from "../../components/Navbar/NavbarDelivery";
import DeliveryDashboardComponent from "../../navigation/DeliveryDashboard";
import { useAuth } from "../../Login/context/useAuth"; // 👈 Importa el hook de tu AuthProvider

const DeliveryDashboardPage = () => {
  const { userId, name, role, team, loading: authLoading, token, isAuthenticated, logout } = useAuth();

  // Validación básica de sesión
    if (!isAuthenticated || !userId || !name || !role) {
      return (
        <View style={{}}>
          <Text>Debes iniciar sesión para ver los pedidos entregados.</Text>
        </View>
      );
  }

  const teamName = typeof team === "object" ? team?.teamName : team;

  const user = {
    id: userId,
    name: name ?? "",
    role: role ?? "",
    team: teamName ?? "N/A",
  };

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

