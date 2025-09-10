import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import MissingReport from '../../components/Notification/MissingReport';
import { useRoute, type RouteProp } from '@react-navigation/native';
import type { DepotStackParamList } from '../../types/DepotStackType';
import type { ReportOrderMissingRequest } from '../../types/Missing';
import type { DepotOrderDTO } from '../../types/OrderDTO';
import { ValidationMissingReport } from '../../validations/ValidationMissingReport';
import NavbarOperator from '../../components/Navbar/NavbarOperator';

 
import { useAuth } from '../../Login/context/useAuth';


type MissingRouteProp = RouteProp<DepotStackParamList, 'MissingReport'>;

const MissingPage = () => {
  const { params } = useRoute<MissingRouteProp>();
  const order: DepotOrderDTO = params.order;

  const { userId, name, role, isAuthenticated, logout } = useAuth();
  const user = { id: userId!, name:name!, role:role! };

  if (!userId) {
    
    throw new Error("El usuario no está autenticado");
  }

  const [description, setDescription] = useState('');

  
  const onSubmit = () => {
    if (!description.trim()) {
      Alert.alert('Error', 'La descripción no puede estar vacía');
      return;
    }

    const missingRequest: ReportOrderMissingRequest = {
      depotOrderId: order.depotOrderId,
      operatorUserId: userId, 
      salesOrderId: order.salesOrderId,
      missingReason: 'Faltante detectado',  
      missingDescription: description.trim(),
      missingItems: order.items.map(item => ({
        orderItemId: item.id,
        productName: item.productName,
        productBrand: item.productBrand,
        packaging: item.packagingType ?? 'Existen faltantes dentro del pedido', 
        quantity: item.quantity,
      })),
    };

    
    ValidationMissingReport(description, missingRequest, (response) => {

      Alert.alert(
        'Notificación Enviada',
        `Descripción: ${description ?? 'Sin descripción'}`
      );
      setDescription(description ?? '');
    });
  };

  const onNotifyMissing = (desc: string) => {
    setDescription(desc);
  };

  return (
    <View style={{ flex: 1 }}>
      <NavbarOperator 
      user={user} 
      isAuthenticated={isAuthenticated} 
      logout={logout}
      />
      <MissingReport
        description={description}
        onNotifyMissing={onNotifyMissing}
        onSubmit={onSubmit}
        missing={order} 
      />
    </View>
  );
};

export default MissingPage;