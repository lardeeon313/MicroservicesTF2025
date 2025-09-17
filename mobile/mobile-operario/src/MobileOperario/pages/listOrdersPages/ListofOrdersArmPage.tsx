import React, { useState, useEffect } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import ListofArmOrders from "../../components/listOrders/ListofArmOrders";
import NavbarOperator from "../../components/Navbar/NavbarOperator";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DepotStackParamList } from "../../types/DepotStackType";
import { DepotOrderDTO, DepotOrderStatus } from "../../types/OrderDTO";
import { useArmOrders } from "../../hocks/useArmOrders";

import { useAuth } from "../../Login/context/useAuth";  

const ListofOrdersArmPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<DepotStackParamList>>();

  const { userId, name, role, isAuthenticated, logout , team} = useAuth();

 
  const user = userId && name && role 
    ? { id: userId, name, role, team }  // 👈 ahora incluye el team
    : null;

  const { armOrders: orders, loading, error } = useArmOrders(user?.id ?? "");
  
  const [localOrders, setLocalOrders] = useState<DepotOrderDTO[]>([]);

  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  
  const ArmOrders = localOrders.filter(
    (order) => order.status === DepotOrderStatus.InPreparation
  );

  
  const handleSeeDetail = (order: DepotOrderDTO) => {
    if (!user) return; 
    navigation.navigate("DetailOrder", {
      orderId: order.depotOrderId,
      operatorUserId: user.id,
    });
  };

    
  if (loading) {
    return <Text style={{ padding: 16 }}>Cargando pedidos...</Text>;
  }

  if (error) {
    return <Text style={{ padding: 16, color: "red" }}>Error: {error.message}</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <NavbarOperator
        user={user}
        isAuthenticated={isAuthenticated}
        logout={logout}
      />

      <Text
        style={{
          fontSize: 22,
          fontWeight: "600",
          marginTop: 20,
          marginBottom: 20,
          color: "#333",
          letterSpacing: 0.5,
          textAlign: "center",
        }}
      >
        Pedidos en Preparación
      </Text>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {ArmOrders.length === 0 ? (
          <Text style={{ fontSize: 18, textAlign: "center" }}>
            Aun no hay pedidos en Preparación.
          </Text>
        ) : (
          ArmOrders.map((order) => (
            <ListofArmOrders
              id={order.depotOrderId}
              customer={order.customerName}
              key={order.depotOrderId}
              order={order}
              onSeeDetail={() => handleSeeDetail(order)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default ListofOrdersArmPage;

