import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { DepotStackParamList } from '../../types/DepotStackType';
import type { Order } from '../../../otherTypes/OrderType';
import NavbarOperator from '../Navbar/NavbarOperator';
import { OrderStatusLabels } from '../../constants/UseStatusOrderOperator';

type Props = {
  order: Order;
  id: number;
  customer: string; 
  onSeeDetail: () => void; 
}

const ListofArmOrders = ({ order ,id,customer,onSeeDetail}: Props) => {
  return (
      <View style={{ backgroundColor: "#ffffff", padding: 20, borderRadius: 12, marginBottom: 16, shadowColor: "#000", elevation: 4 }}>
        <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 6 }}>
          Pedido#: {order.id.toString()}
        </Text>
        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 6 }}>
          Cliente: {customer}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 }}>
          <TouchableOpacity style={{ backgroundColor: '#3B82F6', padding: 8, borderRadius: 8 }} onPress={onSeeDetail}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Ver Detalle</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 20, color: '#6B7280', marginTop: 12 }}>Estado: {OrderStatusLabels[order.status]}</Text>
      </View>
  );

}

export default ListofArmOrders;