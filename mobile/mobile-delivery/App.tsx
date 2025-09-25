import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import LogisticNavigation from "./src/MobileDelivery/navigation/LogisticNavigation";
import { API_BASE_URL } from "@env";

export default function App() {
  useEffect(() => {
    console.log("🔗 API_BASE_URL:", API_BASE_URL);
  }, []);

  return (
    <NavigationContainer>
      <LogisticNavigation />
    </NavigationContainer>
  );
}
