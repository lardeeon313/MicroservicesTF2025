import React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import DepotNavigator from "./src/operario/navigation/DepotNativagator";


export default function App() {
  return (
    <NavigationContainer>
      <DepotNavigator />
    </NavigationContainer>
  );
}

