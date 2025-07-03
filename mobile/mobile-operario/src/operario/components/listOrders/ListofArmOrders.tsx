// ListOfArmOrders.tsx
import { View, Text, TouchableOpacity } from 'react-native';
import type { DepotOrderDTO } from '../../types/OrderDTO';
import { OrderStatusLabels } from '../../constants/UseStatusOrderOperator';
import { DepotOrderStatus } from '../../types/OrderDTO';

type Props = {
  order: DepotOrderDTO;
  id: number;
  customer: string; 
  onSeeDetail: () => void;
};

const ListOfArmOrders = ({ order, id, customer, onSeeDetail }: Props) => {
  return (
    <View style={{ backgroundColor: "#ffffff", padding: 20, borderRadius: 12, marginBottom: 16, shadowColor: "#000", elevation: 4 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
        Pedido# : {order.depotOrderId.toString()}
      </Text>
      <Text style={{ fontSize: 20, fontWeight: '300', marginTop: 4 }}>
        Cliente: {customer}
      </Text>
      <Text style={{ marginTop: 4, fontSize: 20 }}>
        Estado: {OrderStatusLabels[order.status as DepotOrderStatus]}
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 12 }}>
        <TouchableOpacity style={{ backgroundColor: '#3B82F6', padding: 8, borderRadius: 8 }} onPress={onSeeDetail}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Ver Detalle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ListOfArmOrders;
