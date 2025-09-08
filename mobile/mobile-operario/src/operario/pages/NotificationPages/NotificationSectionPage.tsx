import React from 'react';
import { View, Text, ActivityIndicator } from "react-native";
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { DepotStackParamList } from '../../types/DepotStackType';
import NotificacionSection from '../../components/Notification/NotifactionSection';
import NavbarOperator from '../../components/Navbar/NavbarOperator';
import { useGetNotificationMissing } from '../../hocks/useGetNotificationsMissing';
import { useAuth } from "../../../Login/context/useAuth";

export default function NotificationSectionPage() {
  const { userId, name, role } = useAuth();
  const { params } = useRoute<RouteProp<DepotStackParamList, "NotificationPage">>();
  const { order } = params;

  // Validar que userId no sea null
  if (!userId) {
    return <Text style={{ padding: 16, color: 'red' }}>Usuario no autenticado</Text>;
  }

  const { order: fullOrder, loading, error } = useGetNotificationMissing(order.depotOrderId, userId);

  if (loading) return <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 40 }} />;
  if (error) return <Text style={{ color: "red", padding: 16 }}>{error.message || 'Error desconocido'}</Text>;
  if (!fullOrder) return <Text style={{ padding: 16 }}>No se encontró el pedido</Text>;

  return (
    <View style={{ flex: 1 }}>
      <NavbarOperator 
        user={{ name: name || 'Operario', role: role || 'Operario' }} 
        isAuthenticated={true} 
        logout={() => console.log("Cerrar sesión")} 
      />
      <NotificacionSection missingItems={fullOrder.missings} />
    </View>
  );
}
