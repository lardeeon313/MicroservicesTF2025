// pages/MissingAndPreparationOrdersPage.tsx
import React from "react";
import { View, Text, ActivityIndicator, Alert, ScrollView } from "react-native";
import NavbarOperator from "../../components/Navbar/NavbarOperator";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DepotStackParamList } from "../../types/DepotStackType";
import { useMissingOrders } from "../../hocks/useMissingOrders";
import type { DepotOrderDTO, DepotOrderStatus } from "../../types/OrderDTO";
import ListOfMissingOrders from "../../components/listOrders/ListofMissingOrders";
import { ValidationToMissingToPreparation } from "../../validations/ValidationToMissingToPreparation";

const user = {
  name: "Juan Pérez",
  role: "Operario",
  id: "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
};

const isAuthenticated = true;

const MissingAndPreparationOrdersPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<DepotStackParamList>>();
  const { missingOrders: orders, loading, error } = useMissingOrders(user.id);

  const goToDetalle = (order: DepotOrderDTO) => {
    navigation.navigate("DetailOrder", {
      orderId: order.depotOrderId,
      operatorUserId: user.id,
    });
  };

  const goToNotificaciones = (order: DepotOrderDTO) => {
    navigation.navigate("NotificationPage", { order });
  };

  const goToEmitirFaltante = (order: DepotOrderDTO) => {
    try {
      navigation.navigate("MissingReport", {
        order,
      });
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al generar el reporte de faltante.");
    }
  };

  const marcarComoPreparado = (order: DepotOrderDTO) => {
    // Aquí podrías integrar lógica real para actualizar el estado
    //console.log(`Pedido ${order.depotOrderId} marcado como preparado`);
    const { canChange, reason } = ValidationToMissingToPreparation(order);
    if (!canChange) {
      Alert.alert("Acción no permitida", reason || "No se puede actualizar el estado.");
      return;
    }
    // Continuar con la lógica de marcado
    console.log(`✅ Pedido ${order.depotOrderId} marcado como preparado`);
    // Lógica real de cambio de estado acá
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 40 }} />;
  }

  if (!orders.length) {
    return (
      <View style={{ padding: 20 }}>
        <Text>No se encontraron pedidos con faltantes o en preparación.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <NavbarOperator
        user={user}
        isAuthenticated={isAuthenticated}
        logout={() => console.log("Cerrar sesión")}
      />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 22,fontWeight: '600',marginBottom: 20,color: '#333', letterSpacing: 0.5, textAlign: 'center'}}>
          Pedidos con faltantes
        </Text>
        {orders.map((order) => (
          <ListOfMissingOrders
            key={order.depotOrderId}
            order={order}
            missings={order.missings}
            onVerDetalle={() => goToDetalle(order)}
            onEmitirFaltante={() => goToEmitirFaltante(order)}
            onMarcarArmado={() => marcarComoPreparado(order)}
            onSeccionNotificaciones={() => goToNotificaciones(order)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default MissingAndPreparationOrdersPage;
