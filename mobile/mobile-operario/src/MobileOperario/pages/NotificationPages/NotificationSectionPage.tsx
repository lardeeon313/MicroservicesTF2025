import React from 'react';
import { View, Text, ActivityIndicator } from "react-native";
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { DepotStackParamList } from '../../types/DepotStackType';
import NotificacionSection from '../../components/Notification/NotifactionSection';
import NavbarOperator from '../../components/Navbar/NavbarOperator';
import { useGetNotificationMissing } from '../../hocks/useGetNotificationsMissing';
  
import { useAuth } from '../../Login/context/useAuth';


const NotificationSectionPage = () => {
  const { params } = useRoute<RouteProp<DepotStackParamList, "NotificationPage">>();
  const { order } = params;

  const { userId, name, role, isAuthenticated, logout, team } = useAuth();
  
  const user = userId && name && role 
    ? { id: userId, name, role, team } 
    : null;

  if (!user) {
    return <Text>No hay usuario autenticado.</Text>;
  }

  const { order: fullOrder, loading, error } = useGetNotificationMissing(order.depotOrderId, user.id);

  if (loading) return <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 40 }} />;
  if (!fullOrder || error)
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ color: "red", fontWeight: "bold" }}>No se pudo cargar el pedido con faltantes.</Text>
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      <NavbarOperator user={user} isAuthenticated={isAuthenticated} logout={logout} />
      <View style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
          Faltantes del Pedido#: {fullOrder.depotOrderId}
        </Text>
        <NotificacionSection missingItems={fullOrder.missings} />
      </View>
    </View>
  );
};

export default NotificationSectionPage;
