import { View, Text, TouchableOpacity } from 'react-native';
import { OrderStatusLabels } from '../../constants/UseStatusOrderOperator';
import { DepotOrderDTO, DepotOrderStatus } from '../../types/OrderDTO';

type Props = {
  order: DepotOrderDTO;
  customer: string;
  status: DepotOrderStatus;
  onSeeDetail: () => void;
  onAceeptOrder: () => void;
};

const ListofConfirmedOrders = ({ order, customer, status, onSeeDetail, onAceeptOrder }: Props) => {
  const address = order.address; // ✅ tomamos la dirección

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
        Pedido# : {order.depotOrderId}
      </Text>

      <Text style={{ fontSize: 20, fontWeight: '300', marginTop: 4 }}>
        Cliente: {customer}
      </Text>

      <Text style={{ marginTop: 4, fontSize: 20 }}>
        Estado: {OrderStatusLabels[status as DepotOrderStatus]}
      </Text>
      
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
        <TouchableOpacity
          onPress={onSeeDetail}
          style={{ backgroundColor: '#3B82F6', padding: 8, borderRadius: 8 }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Ver Detalle</Text>
        </TouchableOpacity>

        {status === DepotOrderStatus.Assigned && (
          <TouchableOpacity
            onPress={onAceeptOrder}
            style={{ backgroundColor: '#F59E0B', padding: 8, borderRadius: 8 }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Confirmar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ListofConfirmedOrders;
