import { View, Text,Pressable, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { DepotStackParamList } from '../../types/DepotStackType';
import type { DepotOrderDTO } from '../../types/OrderDTO';
import NavbarOperator from '../Navbar/NavbarOperator';
import { OrderStatusLabels } from '../../constants/UseStatusOrderOperator';
import { DepotOrderStatus } from '../../types/OrderDTO';
import { useState } from 'react';

type Props = {
  order: DepotOrderDTO;
  id: number;
  customer: string; 
  onSeeDetail: () => void;
  onSendToBill: () => void;
}
//Nuevo: D 
interface DepotOrderItem{
  id: number;
  productName: string;
  isReady: boolean; // ✅ NECESARIO para validar
  packaging?: string | null;
  quantity: number;
}

const ListofArmOrders = ({ order ,id,customer,onSeeDetail,onSendToBill}: Props) => {
  //Codigo para enviar el pedido a facturar:
  const [modalVisible,setModalVisible] = useState(false);
  
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const handleConfirm = () => {
    closeModal();
    onSendToBill();
  }

  return (
      <View style={{ backgroundColor: "#ffffff", padding: 20, borderRadius: 12, marginBottom: 16, shadowColor: "#000", elevation: 4 }}>
        <Text style={{ fontSize: 18,  fontWeight: 'bold' }}>
          Pedido# : {order.depotOrderId.toString()}
        </Text>
        <Text style={{ fontSize: 20, fontWeight: '300', marginTop: 4  }}>
          Cliente: {customer}
        </Text>
        <Text style={{ marginTop: 4,fontSize: 20 }}>
          Estado: {OrderStatusLabels[order.status as DepotOrderStatus]}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 12 }}>
          <TouchableOpacity style={{ backgroundColor: '#3B82F6', padding: 8, borderRadius: 8, marginRight:12 }} onPress={onSeeDetail}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Ver Detalle</Text>
          </TouchableOpacity>
          {order.status !== DepotOrderStatus.SentToBilling && (
            <TouchableOpacity style={{ backgroundColor: '#FF0000', padding: 8, borderRadius: 8 }} onPress={openModal}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Facturar pedido</Text>
            </TouchableOpacity>
          )}
        </View>

        {/** MODAL PARA CONFIRMAR LA FACTURACION DEL PEDIDO*/}
        <Modal
          animationType='fade'
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={{flex: 1,backgroundColor: 'rgba(0, 0, 0, 0.4)',justifyContent: 'center',alignItems: 'center',}}>
            <View style={{backgroundColor: '#fff',borderRadius: 12,padding: 20,width: '85%',alignItems: 'center',elevation: 10}}>
              <Text style={{fontSize: 17,fontWeight: 'bold',marginBottom: 12}}>¿Confirmas facturación del pedido {order.depotOrderId}?</Text>
              <Text>ID del pedido: {order.depotOrderId}</Text>
              <Text>Cliente: {customer}</Text>
              <Text>Email: {order.customerEmail}</Text>
              <Text>Fecha : {order.orderDate}</Text>
              
              <View style={{flexDirection: 'row',justifyContent: 'space-between',marginTop: 20,width: '100%'}}>
                <Pressable style={[{flex: 1,marginHorizontal: 5,paddingVertical: 10,borderRadius: 8,alignItems: 'center'}, { backgroundColor: '#4CAF50' }]} onPress={handleConfirm}>
                  <Text style={{color: '#fff',fontWeight: 'bold'}}>Facturar</Text>
                </Pressable>
                <Pressable style={[{flex: 1,marginHorizontal: 5,paddingVertical: 10,borderRadius: 8,alignItems: 'center'}, { backgroundColor: '#F44336' }]} onPress={closeModal}>
                  <Text style={{color: '#fff',fontWeight: 'bold'}}>Cancelar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
  );

}

export default ListofArmOrders;