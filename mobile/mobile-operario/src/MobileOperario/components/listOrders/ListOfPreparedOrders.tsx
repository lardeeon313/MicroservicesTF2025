import { View, Text, Pressable, TouchableOpacity, Modal } from 'react-native';
import { useState } from 'react';
import type { DepotOrderDTO } from '../../types/OrderDTO';
import { OrderStatusLabels } from '../../constants/UseStatusOrderOperator';
import { DepotOrderStatus } from '../../types/OrderDTO';
import { ListCollapse,Receipt } from "lucide-react-native";

type Props = {
  order: DepotOrderDTO;
  id: number;
  customer: string;
  onSeeDetail: () => void;
  onSendToBill: () => void;
};

const ListOfPreparedOrders = ({ order, id, customer, onSeeDetail, onSendToBill }: Props) => {
  const address = order.address;
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const handleConfirm = () => {
    closeModal();
    onSendToBill();
  };

  return (
    <View style={{ backgroundColor: "#ffffff", padding: 20, borderRadius: 12, marginBottom: 16, shadowColor: "#000", elevation: 4 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
        Pedido #{order.depotOrderId.toString()}
      </Text>

      <View style={{marginTop: 8}}>
        <View style={{ marginBottom: 12, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 14, color: '#666', fontWeight: 'bold',marginRight: 16 }}>
            Cliente:
          </Text>
          <Text style={{ fontSize: 18, fontWeight: '400',color: '#000'}}>
            {customer}
          </Text>
        </View>

        <View style={{ marginBottom: 12, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 14, color: '#666', fontWeight: 'bold',marginRight: 16 }}>
            Estado: 
          </Text>
          <Text style={{ fontSize: 18, fontWeight: '400',color: '#000'}}>
            {OrderStatusLabels[order.status as DepotOrderStatus]}
          </Text>
        </View>
      </View>


      {address && (
        <View
          style={{
            marginTop: 12,
            backgroundColor: '#f9f9f9',
            padding: 12,
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: '700',
              marginBottom: 6,
              color: '#333',
            }}
          >
            📍 Dirección de entrega
          </Text>

          <Text style={{ fontSize: 16, color: '#222', marginBottom: 2 }}>
            {`${address.street} ${address.number}${address.apartment ? `, ${address.apartment}` : ''}`}
          </Text>

          <Text style={{ fontSize: 15.5, color: '#444', marginBottom: 2 }}>
            {`${address.city}, ${address.province}`}
          </Text>

          <Text style={{ fontSize: 15, color: '#777' }}>
            {address.country}
          </Text>
        </View>
      )}


      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 12 }}>
        <TouchableOpacity style={{
            backgroundColor: '#3B82F6',
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={onSeeDetail}>
          <ListCollapse size={20} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Ver Detalle</Text>
        </TouchableOpacity>
        {order.status !== DepotOrderStatus.SentToBilling && (
          <TouchableOpacity style={{
            backgroundColor: '#FF0000',
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
           }} 
            onPress={openModal}>
            <Receipt size={20} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Enviar pedido a facturar</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '85%', alignItems: 'center', elevation: 10 }}>
            <Text style={{ fontSize: 17, fontWeight: 'bold', marginBottom: 12 }}>¿Quieres enviar a factuar el pedido:  {order.depotOrderId}?</Text>
            <Text style={{fontSize: 16,color: "#374151",marginBottom: 6,}}>
              <Text style={{fontWeight: "bold",color: "#111827",}}>Número del pedido: </Text>
              {order.depotOrderId}
            </Text>

            <Text style={{fontSize: 16,color: "#374151",marginBottom: 6,}}>
              <Text style={{fontWeight: "bold",color: "#111827",}}>Cliente: </Text>
              {customer}
            </Text>

            <Text style={{fontSize: 16,color: "#374151",marginBottom: 6,}}>
              <Text style={{fontWeight: "bold",color: "#111827",}}>Email: </Text>
              {order.customerEmail}
            </Text>

            <Text style={{fontSize: 16,color: "#374151",marginBottom: 6,}}>
              <Text style={{fontWeight: "bold",color: "#111827",}}>Fecha de emisión: </Text>
              {new Date(order.orderDate).toLocaleDateString()}
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, width: '100%' }}>
              <Pressable style={[{ flex: 1, marginHorizontal: 5, paddingVertical: 10, borderRadius: 8, alignItems: 'center' }, { backgroundColor: '#4CAF50' }]} onPress={handleConfirm}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Enviar a facturacion</Text>
              </Pressable>
              <Pressable style={[{ flex: 1, marginHorizontal: 5, paddingVertical: 10, borderRadius: 8, alignItems: 'center' }, { backgroundColor: '#F44336' }]} onPress={closeModal}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};


export default ListOfPreparedOrders;

