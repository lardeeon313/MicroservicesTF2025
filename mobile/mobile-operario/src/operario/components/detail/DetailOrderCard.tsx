import { View, Text, ScrollView } from 'react-native';
import { Order } from '../../../otherTypes/OrderType';
import CheckList from '../additional/checkList/CheckList';


type Props = {
  order: Order;
}


const DetailOrderCard = ({order}: Props) => {
  
  //const {TotalProducts} = order.items.reduce((acc,item) => acc + item.quantity, 0);

  return(
    <ScrollView style={{ flex: 1, backgroundColor: '#f9f9f9', padding: 16 }}>
      <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 12 }}>
        Detalle del Pedido #{order.id}
      </Text>

      <View style={{backgroundColor: '#fff', borderRadius: 8, padding: 16, elevation: 2 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
          Pedido: {order.id}
        </Text>

        <Text style={{fontSize: 16, marginBottom: 4 }}>
          Cliente: {order.customerFirstName} {order.customerLastName}
        </Text>

        <Text style={{ fontSize: 20, marginBottom: 12 }}>
          Estado: {order.status}
        </Text>

        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
          Productos en el pedido: {order.items.length}
        </Text>

        {order.items.map((item, index) => (
          <CheckList
            key={index}
            productName={item.productName}
            quantity={item.quantity}
          />
        ))}
      </View>
    </ScrollView>
  )
}

export default DetailOrderCard;
// This component displays the details of an order, including the customer information and a checklist of products.