import { View, Text, TouchableOpacity } from 'react-native';
import { OrderStatusLabels } from '../../constants/UseStatusOrderOperator';
import { DepotOrderDTO, DepotOrderStatus } from '../../types/OrderDTO';
import { ListCollapse,PackageCheck } from "lucide-react-native";

type Props = {
  order: DepotOrderDTO;
  customer: string;
  status: DepotOrderStatus;
  onSeeDetail: () => void;
  onAceeptOrder: () => void;
};

const ListofConfirmedOrders = ({ order, customer, status, onSeeDetail, onAceeptOrder }: Props) => {
  const address = order.address; 

  return (
    <View
      style={{
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 16,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
        Pedido #{order.depotOrderId}
      </Text>

      <View style={{ marginTop: 8 }}>
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
            {OrderStatusLabels[status as DepotOrderStatus]}
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

      <View style={{ flexDirection: 'row', marginTop: 12, gap: 10 }}>
  
        {/* Botón Ver Detalle */}
        <TouchableOpacity
          onPress={onSeeDetail}
          style={{
            backgroundColor: '#3B82F6',
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
            gap: 8
          }}
        >
          <ListCollapse size={20} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Ver Detalle</Text>
        </TouchableOpacity>

        {/* Botón Confirmar */}
        {status === DepotOrderStatus.Assigned && (
          <TouchableOpacity
            onPress={onAceeptOrder}
            style={{
              backgroundColor: '#F59E0B',
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 8
            }}
          >
            <PackageCheck size={20} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Confirmar</Text>
          </TouchableOpacity>
        )}

      </View>

    </View>
  );
};

export default ListofConfirmedOrders;
