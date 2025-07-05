//pages/OperatorDashboardPage.tsx

import React from "react";
import { View } from "react-native";
import NavbarOperator from "../../components/Navbar/NavbarOperator";
import OperatorDashboardComponent from "../../navigation/OperatorDashboard";
import { useAuth } from "../../../Login/context/useAuth";

const OperatorDashboardPage = () => {
  const { name, role, isAuthenticated, logout } = useAuth();

  const user = name && role ? { name, role } : null;
    console.log('user:', user);
    console.log('isAuthenticated:', isAuthenticated);
  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <NavbarOperator user={user} isAuthenticated={isAuthenticated} logout={logout} />
      <OperatorDashboardComponent />
    </View>
  );
};

export default OperatorDashboardPage;
