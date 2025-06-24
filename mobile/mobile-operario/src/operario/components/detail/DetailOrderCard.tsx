import { View, Text, ScrollView } from 'react-native';
import { Order, OrderStatus } from '../../../otherTypes/OrderType';
import CheckList from '../additional/checkList/CheckList';
import { OrderStatusLabels } from '../../constants/UseStatusOrderOperator';
//NUEVO: 
import { DepotOrderDTO, DepotOrderStatus } from '../../types/OrderDTO';


type Props = {
  order: DepotOrderDTO;
}


const DetailOrderCard = ({order}: Props) => {
  
  //const {TotalProducts} = order.items.reduce((acc,item) => acc + item.quantity, 0);
  console.log("Detalle del pedido:", order);
  return(
    <ScrollView style={{ flex: 1, backgroundColor: '#f9f9f9', padding: 16 }}>
      <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 12 }}>
        Detalle del Pedido #{order.depotOrderId}
      </Text>

      <View style={{backgroundColor: '#fff', borderRadius: 8, padding: 16, elevation: 2 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
          Pedido#: {order.depotOrderId}
        </Text>

        <Text style={{fontSize: 16, marginBottom: 4 }}>
          Cliente: {`${order.customerName}`}
        </Text>

        <Text style={{ fontSize: 20, marginBottom: 12 }}>
          Estado: {OrderStatusLabels[order.status as DepotOrderStatus]}
        </Text>

        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
          Productos en el pedido: {order.items.length}
        </Text>

        {order.items.map((item, index) => (
          <CheckList
            key={index}
            productName={item.productName}
            quantity={item.quantity}
            disblead={order.status === DepotOrderStatus.Assigned }
          />
        ))}
      </View>
    </ScrollView>
  )
}

export default DetailOrderCard;
// This component displays the details of an order, including the customer information and a checklist of products.