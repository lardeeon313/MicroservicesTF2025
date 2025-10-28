import React from "react";
import { View } from "react-native";
import NavbarDelivery from "../../components/Navbar/NavbarDelivery";
import DeliveryDashboardComponent from "../../navigation/DeliveryDashboard";
import { useAuth } from "../../Login/context/useAuth"; // 👈 Importa el hook de tu AuthProvider

const DeliveryDashboardPage = () => {
  const { userId, name, role, isAuthenticated, logout, team } = useAuth();

  const teamName = typeof team === "object" ? team?.teamName : team;

  const user = {
    name: name ?? "",
    role: role ?? "",
    team: teamName ?? null,
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

