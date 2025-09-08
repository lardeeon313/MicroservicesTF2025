import React, { useState } from 'react';
import { View, Text, Alert, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import type { DepotStackParamList } from '../../types/DepotStackType';
import type { DepotOrderDTO } from '../../types/OrderDTO';
import NavbarOperator from '../../components/Navbar/NavbarOperator';
import AcceptOrder from '../../components/detail/AcceptOrder';
import { useGetOneOrder } from '../../hocks/useGetOneOrder';
import { useOrderManagment } from "./OrderManagmentPage";
import { RejectOrderWithReasonModal } from "../../components/additional/AlertWindows/AlertManager";
import { useAuth } from "../../../Login/context/useAuth";

type AcceptOrderPageProp = RouteProp<DepotStackParamList, "AcceptOrder">;

export default function AcceptOrderPage() {
  const { userId, name, role } = useAuth();
  const { params } = useRoute<AcceptOrderPageProp>();
  
  // Validar que userId no sea null
  if (!userId) {
    return <Text style={{ padding: 16, color: 'red' }}>Usuario no autenticado</Text>;
  }

  const { order: fetchedOrder, loading, error } = useGetOneOrder(params.order.depotOrderId, userId);

  const {
    order,
    acceptOrder,
    rejectOrder,
    showMeRejectModal,
    setShowMeRejectModal,
    ConfirmRejectWithReason,
  } = useOrderManagment(fetchedOrder ?? params.order, userId);

  if (loading) return <ActivityIndicator size="large" color="#000" />;
  if (error) return <Text>ERROR: {error}</Text>;

  return (
    <View style={{ flex: 1 }}>
      <NavbarOperator 
        user={{ name: name || 'Operario', role: role || 'Operario' }} 
        isAuthenticated={true} 
        logout={() => console.log("Cerrar sesión")} 
      />
      <AcceptOrder
        order={order}
        onAccept={acceptOrder}
        onReject={rejectOrder}
      />
      <RejectOrderWithReasonModal
        visible={showMeRejectModal}
        onCancel={() => setShowMeRejectModal(false)}
        onConfirm={ConfirmRejectWithReason}
      />
    </View>
  );
}
