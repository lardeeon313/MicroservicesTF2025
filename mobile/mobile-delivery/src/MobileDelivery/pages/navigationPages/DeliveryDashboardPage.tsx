import React from "react";
import { View } from "react-native";
import NavbarDelivery from "../../components/Navbar/NavbarDelivery";
import DeliveryDashboardComponent from "../../navigation/DeliveryDashboard";

const DeliveryDashboardPage = () => {
  // usuario mock para testear
  const mockUser = {
    name: "Carlos Gómez",
    role: "Repartidor",
    team: { teamName: "Zona Norte" }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <NavbarDelivery 
        user={mockUser} 
        isAuthenticated={true}   // 👈 mock
        logout={() => console.log("Logout mock")} // 👈 mock
      />
      <DeliveryDashboardComponent />
    </View>
  );
};

export default DeliveryDashboardPage;
