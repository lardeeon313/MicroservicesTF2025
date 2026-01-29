
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
 
import { useAuth } from '../../Login/context/useAuth';

import GetBack from "../../../components/GetBack";
import Footer from "../../../components/Footer";

const MissingAndPreparationOrdersPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<DepotStackParamList>>();

  const { userId, name, role, isAuthenticated, logout, team } = useAuth();

  if (!isAuthenticated || !userId || !name || !role) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Debes iniciar sesión para ver los pedidos con faltantes.</Text>
      </View>
    );
  }

  const teamName = typeof team === 'object' ? team?.teamName : team;
  
  const user = userId && name && role
    ? { id: userId, name, role, team: teamName ?? null } 
    : null;

  const { missingOrders: orders, loading, error } = useMissingOrders(user?.id ?? "");

  const goToDetalle = (order: DepotOrderDTO) => {
    navigation.navigate("DetailOrder", {
      orderId: order.depotOrderId,
      operatorUserId: userId,
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
    const { canChange, reason } = ValidationToMissingToPreparation(order);
    if (!canChange) {
      Alert.alert("Acción no permitida", reason || "No se puede actualizar el estado.");
      return;
    }
    
    
    
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <NavbarOperator
        user={user}
        isAuthenticated={isAuthenticated}
        logout={logout}
      />

      <View style={{ marginTop: 10, marginLeft: 10}}>
        <GetBack/>
      </View>


      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 22,fontWeight: '600',marginBottom: 20,color: '#333', letterSpacing: 0.5, textAlign: 'center'}}>
          Pedidos con faltantes
        </Text>
        {orders.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 24,
              paddingVertical: 60,
            }}
          >
            {/* Ícono */}
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: '#fee2e2',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <Text style={{ fontSize: 48 }}>🚫</Text>
            </View>

            {/* Título */}
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: '#111827',
                textAlign: 'center',
                marginBottom: 8,
              }}
            >
              No hay pedidos con faltantes.
            </Text>

            {/* Descripción */}
            <Text
              style={{
                fontSize: 14,
                color: '#6b7280',
                textAlign: 'center',
                lineHeight: 20,
              }}
            >
              Aún no se encontraron pedidos con faltantes o en preparacion,{'\n'}
              vuelve a intentarlo más tarde.
            </Text>
          </View>
        ) : (
          orders.map((order) => (
            <ListOfMissingOrders
              key={order.depotOrderId}
              order={order}
              missings={order.missings}
              onVerDetalle={() => goToDetalle(order)}
              onEmitirFaltante={() => goToEmitirFaltante(order)}
              onMarcarArmado={() => marcarComoPreparado(order)}
              onSeccionNotificaciones={() => goToNotificaciones(order)}
            />
          ))
        )}
      </ScrollView>
      <Footer/>
    </View>
  );
};

export default MissingAndPreparationOrdersPage;
