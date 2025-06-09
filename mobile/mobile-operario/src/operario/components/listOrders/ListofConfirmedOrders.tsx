import { View, Text, TouchableOpacity } from 'react-native';
import { OrderStatus, type Order } from '../../../otherTypes/OrderType'; // Asegúrate de que la ruta sea correcta
import NavbarOperator from '../Navbar/NavbarOperator';
import { ScrollView } from 'react-native';
import { OrderStatusLabels } from '../../constants/UseStatusOrderOperator';

type Props = {
  order: Order;
  onSeeDetail: () => void;
  onAceeptOrder: () => void;
}

const ListofConfirmedOrders = ({order, onSeeDetail, onAceeptOrder}: Props) => {
  return(
      <View style={{backgroundColor: '#ffffff',padding: 16,borderRadius: 8,shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.1,shadowRadius: 4,elevation: 3,marginBottom: 16,}}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
          Pedido #{order.id}
        </Text>
        <Text style={{ marginTop: 4 }}>
          Cliente: {order.customerFirstName} {order.customerLastName}
        </Text>
        <Text style={{ marginTop: 4,fontSize: 20 }}>
          Estado: {OrderStatusLabels[order.status]}
        </Text>

        <View style={{ flexDirection: 'row', marginTop: 12, gap: 10 }}>
          <TouchableOpacity
            onPress={onSeeDetail}
            style={{ backgroundColor: '#3B82F6', padding: 8, borderRadius: 8 }}>
            <Text style={{color: '#fff', fontWeight: 'bold' }}>Ver Detalle</Text>
          </TouchableOpacity>

          {order.status === OrderStatus.Pending && (
            <TouchableOpacity
              onPress={onAceeptOrder}
              style={{ backgroundColor: '#F59E0B', padding: 8, borderRadius: 8 }}>
              <Text style={{  color: '#fff', fontWeight: 'bold'}}>Confirmar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
  )
}

export default ListofConfirmedOrders;


// This component displays a list of confirmed orders with options to view details and emit missing items.