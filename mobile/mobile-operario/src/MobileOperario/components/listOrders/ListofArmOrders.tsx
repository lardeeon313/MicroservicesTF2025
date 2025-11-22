import { View, Text, TouchableOpacity } from 'react-native';
import type { DepotOrderDTO } from '../../types/OrderDTO';
import { OrderStatusLabels } from '../../constants/UseStatusOrderOperator';
import { DepotOrderStatus } from '../../types/OrderDTO';
import { ListCollapse } from "lucide-react-native";

type Props = {
  order: DepotOrderDTO;
  id: number;
  customer: string; 
  onSeeDetail: () => void;
};

const ListOfArmOrders = ({ order, id, customer, onSeeDetail }: Props) => {
  const address = order.address;

  return (
    <View
      style={{
        backgroundColor: "#ffffff",
        padding: 20,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: "#000",
        elevation: 4,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
        Pedido#: {order.depotOrderId.toString()}
      </Text>

      <Text style={{ fontSize: 20, fontWeight: '300', marginTop: 4 }}>
        Cliente: {customer}
      </Text>

      <Text style={{ marginTop: 4, fontSize: 20 }}>
        Estado: {OrderStatusLabels[order.status as DepotOrderStatus]}
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

      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 12 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#3B82F6',
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
            gap: 8
          }}
          onPress={onSeeDetail}
        >
          <ListCollapse size={20} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Ver Detalle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ListOfArmOrders;
