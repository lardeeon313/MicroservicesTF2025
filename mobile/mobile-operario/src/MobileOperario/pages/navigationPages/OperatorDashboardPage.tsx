import React from "react";
import { View } from "react-native";
import NavbarOperator from "../../components/Navbar/NavbarOperator";
import OperatorDashboardComponent from "../../navigation/OperatorDashboard";
import { useAuth } from "../../Login/context/useAuth";

const OperatorDashboardPage = () => {
  const { userId, name, role, isAuthenticated, logout, team } = useAuth();

  const user = userId && name && role 
    ? { id: userId, name, role, team }  
    : null;

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <NavbarOperator user={user} isAuthenticated={isAuthenticated} logout={logout} />
      <OperatorDashboardComponent />
    </View>
  );
};

export default OperatorDashboardPage;
