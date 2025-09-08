import { View, Text, ScrollView ,Image, TouchableOpacity, Alert, Modal} from 'react-native';
import CheckList from '../additional/checkList/CheckList';
import { OrderStatusLabels } from '../../constants/UseStatusOrderOperator';
//NUEVO: 
import { DepotOrderDTO, DepotOrderStatus } from '../../types/OrderDTO';
//NUEVO: 
import ItemOrdersComponent from '../additional/checkList/ItemOrdersComponent';
import { useAuth } from "../../../Login/context/useAuth";
import { useReportOrderMissing } from '../../hocks/useReportOneMissing';
import { useState } from 'react';
import type { ReportOrderMissingRequest } from '../../types/ReportMissing';

type Props = {
  order: DepotOrderDTO;
  operatorUserId: string;
}

export default function DetailOrderCard({order, operatorUserId}: Props) {
  const { userId } = useAuth();
  const [showMissingModal, setShowMissingModal] = useState(false);
  const { reportMissing, looading, erroor, success } = useReportOrderMissing();
  
  // Validar que userId no sea null
  if (!userId) {
    return <Text style={{ padding: 16, color: 'red' }}>Usuario no autenticado</Text>;
  }

  const allItemsReady = order.items.every(item => item.isReady === true);
  //const {TotalProducts} = order.items.reduce((acc,item) => acc + item.quantity, 0);
  console.log("Detalle del pedido:", order);

  const handleReportMissing = async () => {
    try {
      // Solo reportar items que no están listos
      const missingItems = order.items.filter(item => !item.isReady);
      
      if (missingItems.length === 0) {
        Alert.alert('Información', 'No hay items faltantes para reportar');
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
        missingReason: 'Faltante detectado durante preparación', // Campo requerido según el DTO
        missingDescription: 'Producto no disponible en stock para preparación', // Campo requerido según el DTO
        missingItems: missingItems.map(item => ({
          orderItemId: item.id,
          productName: item.productName,
          productBrand: item.productBrand,
          packaging: item.packaging || null,
          quantity: item.quantity
        }))
      };

      await reportMissing(missingRequest);
      
      if (success) {
        Alert.alert(
          'Éxito', 
          `Se reportaron ${missingItems.length} item(s) faltante(s) del pedido #${order.depotOrderId}`
        );
        setShowMissingModal(false);
      }
      
    } catch (error) {
      Alert.alert('Error', 'No se pudo reportar el faltante. Intente nuevamente.');
    }
  };

  const openMissingModal = () => {
    setShowMissingModal(true);
  };
  
  return(
    <View style={{ flex: 1, backgroundColor: '#f9f9f9', padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        <Image
          source={require('../../../assetsImages/LogoVerona.png')}
          style={{
            width: 42,
            height: 42,
            resizeMode: 'contain',
            marginRight: 10,
          }}
        />
      </View>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 12 }}>
        Detalle del Pedido #{order.depotOrderId}
      </Text>

      <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 16, elevation: 2 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
          Pedido#: {order.depotOrderId}
        </Text>

        <Text style={{ fontSize: 16, marginBottom: 4 }}>
          Cliente: {order.customerName}
        </Text>

        <Text style={{ fontSize: 20, marginBottom: 12 }}>
          Estado: {OrderStatusLabels[order.status as DepotOrderStatus]}
        </Text>

        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
          Productos en el pedido: {order.items.length}
        </Text>

        {/* Botón para reportar faltante - solo mostrar si hay items no listos */}
        {order.items.some(item => !item.isReady) && (
          <TouchableOpacity
            style={{
              backgroundColor: '#ff6b6b',
              padding: 12,
              borderRadius: 8,
              alignItems: 'center',
              marginTop: 12
            }}
            onPress={openMissingModal}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
              🚨 Reportar Faltante
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ✅ FlatList se encarga del scroll */}
      <ItemOrdersComponent
        pedidoItems={order.items.map(item => ({
          id: item.id,
          nombre: item.productName,
          marcado: item.isReady,
          embalaje: item.packaging || '', // ✅ NUEVO - valor por defecto para evitar null/undefined
          cantidad: item.quantity,
        }))}
        operatorUserId={userId}
        pedidoStatus={order.status}
      />

      {/* Modal para confirmar reporte de faltante */}
      <Modal
        visible={showMissingModal}
        transparent={true}
        animationType="slide"
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}>
          <View style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 12,
            width: '90%',
            maxWidth: 400
          }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>
              🚨 Reportar Faltante
            </Text>
            
            <Text style={{ fontSize: 16, marginBottom: 8 }}>
              Pedido: #{order.depotOrderId}
            </Text>
            <Text style={{ fontSize: 16, marginBottom: 8 }}>
              Cliente: {order.customerName}
            </Text>
            <Text style={{ fontSize: 16, marginBottom: 16 }}>
              Estado: {OrderStatusLabels[order.status as DepotOrderStatus]}
            </Text>

            <Text style={{ fontSize: 14, marginBottom: 20, color: '#666', textAlign: 'center' }}>
              ¿Estás seguro de que deseas reportar los items faltantes de este pedido? 
              Esta acción notificará al sistema sobre la falta de stock.
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#6c757d',
                  padding: 12,
                  borderRadius: 8,
                  flex: 1,
                  marginRight: 8
                }}
                onPress={() => setShowMissingModal(false)}
              >
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: '#ff6b6b',
                  padding: 12,
                  borderRadius: 8,
                  flex: 1,
                  marginLeft: 8
                }}
                onPress={handleReportMissing}
                disabled={looading}
              >
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                  {looading ? 'Reportando...' : 'Confirmar'}
                </Text>
              </TouchableOpacity>
            </View>

            {erroor && (
              <Text style={{ color: 'red', textAlign: 'center', marginTop: 12 }}>
                Error: {erroor.message}
              </Text>
            )}
          </View>
        </View>
      </Modal>
      
    </View>
  )
}
// This component displays the details of an order, including the customer information and a checklist of products.