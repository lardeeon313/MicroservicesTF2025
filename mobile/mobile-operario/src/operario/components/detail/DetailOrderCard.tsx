import { View, Text, ScrollView ,Image} from 'react-native';
import CheckList from '../additional/checkList/CheckList';
import { OrderStatusLabels } from '../../constants/UseStatusOrderOperator';
//NUEVO: 
import { DepotOrderDTO, DepotOrderStatus } from '../../types/OrderDTO';
//NUEVO: 
import ItemOrdersComponent from '../additional/checkList/ItemOrdersComponent';
//importacion del auth: 
import { useAuth } from '../../../Login/context/useAuth';


type Props = {
  order: DepotOrderDTO;
  operatorUserId: string;
}


const DetailOrderCard = ({order}: Props) => {
  //const allItemsReady = order.items.every(item => item.isReady === true);
  //const {TotalProducts} = order.items.reduce((acc,item) => acc + item.quantity, 0);

  const { userId, name, role, isAuthenticated, logout } = useAuth();
  
  const user = {
    id: userId!,
    name: name!,
    role: role!
  };

  console.log("Detalle del pedido:", order);
  return(
    <View style={{ flex: 1, backgroundColor: '#f9f9f9', padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        <Image
          source={require('../../../assetsImages/LogoVerona.png')}
          style={{
            width: 42,
            height: 42,
            resizeMode: 'contain',
            marginRight: 10,
          }}
        />
      </View>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 12 }}>
        Detalle del Pedido #{order.depotOrderId}
      </Text>

      <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 16, elevation: 2 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
          Pedido#: {order.depotOrderId}
        </Text>

        <Text style={{ fontSize: 16, marginBottom: 4 }}>
          Cliente: {order.customerName}
        </Text>

        <Text style={{ fontSize: 20, marginBottom: 12 }}>
          Estado: {OrderStatusLabels[order.status as DepotOrderStatus]}
        </Text>

        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
          Productos en el pedido: {order.items.length}
        </Text>
      </View>

      {/* ✅ FlatList se encarga del scroll */}
      <ItemOrdersComponent
        pedidoItems={order.items.map(item => ({
          id: item.id,
          nombre: item.productName,
          marcado: item.isReady,
          embalaje: item.packaging, // ✅ NUEVO
          cantidad: item.quantity,
        }))}
        operatorUserId={user.id}
        pedidoStatus={order.status}
      />

      
    </View>
  )
}

export default DetailOrderCard;
// This component displays the details of an order, including the customer information and a checklist of products.