import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
//import { AuthProvider } from "./src/Login/context/AuthProvider";
import { AuthProvider } from "./src/MobileDelivery/Login/context/AuthProvider";
//import { useAuth } from "./src/Login/context/useAuth";
import { useAuth } from "./src/MobileDelivery/Login/context/useAuth";
import LogisticNavigation from "./src/MobileDelivery/navigation/LogisticNavigation";
//import LoginNavigator from "./src/Login/LoginNavigator"; 
import LoginNavigator from "./src/MobileDelivery/Login/LoginNavigator/LoginNavigator";
import { EXPO_PUBLIC_API_BASE_URL } from "@env";
import { ActivityIndicator, View } from "react-native";

function RootNavigation() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#b91c1c" />
      </View>
    );
  }

export default function App() {
  useEffect(() => {
    console.log("🔗 API_BASE_URL:", EXPO_PUBLIC_API_BASE_URL);
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigation />
      </NavigationContainer>
    </AuthProvider>
  );
}
