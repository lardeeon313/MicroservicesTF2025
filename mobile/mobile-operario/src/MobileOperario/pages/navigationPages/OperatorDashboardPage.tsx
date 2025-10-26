import React from "react";
import { View } from "react-native";
import NavbarOperator from "../../components/Navbar/NavbarOperator";
import OperatorDashboardComponent from "../../navigation/OperatorDashboard";
import { useAuth } from "../../Login/context/useAuth";
import GetBack from "../../../components/GetBack";
import Footer from "../../../components/Footer";

const OperatorDashboardPage = () => {

  const { userId, name, role, isAuthenticated, logout, team } = useAuth();

  const teamName = typeof team === 'object' ? team?.teamName : team;

  const user = userId && name && role
    ? { id: userId, name, role, team: teamName ?? null } 
    : null;

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <NavbarOperator user={user} isAuthenticated={isAuthenticated} logout={logout} />
      <OperatorDashboardComponent />
      <Footer/>
    </View>
  );
};

export default OperatorDashboardPage;
