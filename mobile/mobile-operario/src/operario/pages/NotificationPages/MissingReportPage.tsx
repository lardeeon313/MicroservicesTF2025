// MissingReportPage.tsx
import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import MissingReport from '../../components/Notification/MissingReport';
import { useRoute, type RouteProp } from '@react-navigation/native';
import type { DepotStackParamList } from '../../types/DepotStackType';
import type { ReportOrderMissingRequest } from '../../types/Missing';
import type { DepotOrderDTO } from '../../types/OrderDTO';
import { ValidationMissingReport } from '../../validations/ValidationMissingReport';
import NavbarOperator from '../../components/Navbar/NavbarOperator';
import { actualizarEstadoPedidoFaltante } from '../../hocks/actions/updateStatusOrder';

const user = { name: 'Juan Pérez', role: 'Operario', id: 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa' };
const isAuthenticated = true;

type MissingRouteProp = RouteProp<DepotStackParamList, 'MissingReport'>;

const MissingPage = () => {
  const { params } = useRoute<MissingRouteProp>();
  const order: DepotOrderDTO = params.order;

  const [description, setDescription] = useState('');

  // Armamos el objeto para enviar, al enviar usamos la descripción actualizada
  const onSubmit = () => {
    if (!description.trim()) {
      Alert.alert('Error', 'La descripción no puede estar vacía');
      return;
    }

    const missingRequest: ReportOrderMissingRequest = {
      depotOrderId: order.depotOrderId,
      operatorUserId: user.id, // necesario para el backend
      salesOrderId: order.salesOrderId,
      missingReason: 'Faltante detectado',  // o lo que quieras, también podés agregar UI para editarlo
      missingDescription: description.trim(),
      missingItems: order.items.map(item => ({
        orderItemId: item.id,
        productName: item.productName,
        productBrand: item.productBrand,
        packaging: item.packagingType ?? 'No hay producto', //error default 
        quantity: item.quantity,
      })),
    };

    // Enviamos y validamos
    ValidationMissingReport(description, missingRequest, (response) => {
      //actualiza el status del pedido en caso de presentarse un faltante: 
      //const updateOrder = actualizarEstadoPedidoFaltante(missingRequest)
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
      <NavbarOperator user={user} isAuthenticated={isAuthenticated} logout={() => console.log('Cerrar sesión')} />
      <MissingReport
        description={description}
        onNotifyMissing={onNotifyMissing}
        onSubmit={onSubmit}
        missing={order} // ojo: aquí pasamos el pedido completo porque el componente puede necesitar datos
      />
    </View>
  );
};

export default MissingPage;


// Este componente MissingReportPage se encarga de manejar la lógica de negocio relacionada con la notificación de faltantes.