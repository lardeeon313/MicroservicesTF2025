// MissingReportPage.tsx
import React, { useState } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import type { DepotStackParamList } from '../../types/DepotStackType';
import type { DepotOrderDTO } from '../../types/OrderDTO';
import type { ReportOrderMissingRequest } from '../../types/Missing';
import NavbarOperator from '../../components/Navbar/NavbarOperator';
import { actualizarEstadoPedidoFaltante } from '../../hocks/actions/updateStatusOrder';
import { useAuth } from "../../../Login/context/useAuth";

type MissingRouteProp = RouteProp<DepotStackParamList, 'MissingReport'>;

export default function MissingReportPage() {
  const { userId, name, role } = useAuth();
  const { params } = useRoute<MissingRouteProp>();
  const order: DepotOrderDTO = params.order;

  // Validar que userId no sea null
  if (!userId) {
    return <Text style={{ padding: 16, color: 'red' }}>Usuario no autenticado</Text>;
  }

  const handleReportMissing = async () => {
    try {
      // Validar que haya items para reportar
      if (!order.items || order.items.length === 0) {
        Alert.alert('Información', 'No hay items en este pedido para reportar');
        return;
      }

      // Validar campos requeridos según el DTO del backend
      if (!order.depotOrderId || !userId || !order.salesOrderId) {
        Alert.alert('Error', 'Faltan datos requeridos para el reporte');
        return;
      }

      const missingRequest: ReportOrderMissingRequest = {
        depotOrderId: order.depotOrderId,
        operatorUserId: userId,
        salesOrderId: order.salesOrderId,
        missingReason: 'Faltante detectado', // Campo requerido según el DTO
        missingDescription: 'Producto no disponible en stock', // Campo requerido según el DTO
        missingItems: order.items.map(item => ({
          orderItemId: item.id,
          productName: item.productName,
          productBrand: item.productBrand,
          packaging: item.packaging || null,
          quantity: item.quantity
        }))
      };

      // TODO: Implementar el servicio real de reporte de faltantes
      console.log('Reporte de faltante:', missingRequest);
      
      Alert.alert(
        'Información', 
        `Pedido #${order.depotOrderId} - ${order.items.length} item(s) listo(s) para reportar`
      );
      
    } catch (error) {
      Alert.alert('Error', 'No se pudo procesar la solicitud');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <NavbarOperator 
        user={{ name: name || 'Operario', role: role || 'Operario' }} 
        isAuthenticated={true} 
        logout={() => console.log("Cerrar sesión")} 
      />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
          Reportar Faltante - Pedido #{order.depotOrderId}
        </Text>
        <Text style={{ marginBottom: 16 }}>
          Cliente: {order.customerName}
        </Text>
        <Text style={{ marginBottom: 16 }}>
          Estado: {order.status}
        </Text>
        <Text style={{ marginBottom: 20 }}>
          ¿Deseas reportar este pedido como faltante?
        </Text>
        <View style={{ padding: 20, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Acciones disponibles:</Text>
          <Text style={{ marginBottom: 4 }}>• Reportar como faltante</Text>
          <Text style={{ marginBottom: 4 }}>• Actualizar estado del pedido</Text>
          <Text>• Notificar al sistema</Text>
        </View>
      </ScrollView>
    </View>
  );
}