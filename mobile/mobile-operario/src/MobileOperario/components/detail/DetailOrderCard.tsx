import { View, Text, ScrollView ,Image} from 'react-native';
import { OrderStatusLabels } from '../../constants/UseStatusOrderOperator';
import { DepotOrderDTO, DepotOrderStatus } from '../../types/OrderDTO';
import ItemOrdersComponent from '../additional/checkList/ItemOrdersComponent'; 
import { useAuth } from '../../Login/context/useAuth';

type Props = {
  order: DepotOrderDTO;
  operatorUserId: string;
}


const DetailOrderCard = ({order}: Props) => {

  const { userId, name, role, isAuthenticated, logout } = useAuth();
  
  const user = {
    id: userId!,
    name: name!,
    role: role!
  };

  const address = order.address;

  
  return(
    <View style={{ flex: 1, paddingHorizontal: 16 }}>
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 16,
          padding: 12,
          marginBottom: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 6,
          elevation: 6,
        }}
      >
        {/* Header compacto */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
            borderBottomWidth: 1,
            borderBottomColor: '#e5e7eb',
            marginBottom: 8,
          }}
        >
          <Image
            source={require('../../../assetsImages/LogoVerona.png')}
            style={{
              width: 32,
              height: 32,
              resizeMode: 'contain',
              marginRight: 10,
            }}
          />

          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#1f2937',
            }}
          >
            Detalle del Pedido #{order.depotOrderId}
          </Text>
        </View>

        {/* Info en 2 columnas */}
        <View style={{ flexDirection: 'row', marginBottom: 8, gap: 16 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#6b7280', marginBottom: 2, textTransform: 'uppercase' }}>
              Cliente
            </Text>
            <Text style={{ fontSize: 14, color: '#111827', fontWeight: '500' }}>
              {order.customerName}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#6b7280', marginBottom: 2, textTransform: 'uppercase' }}>
              Estado
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '500', color: '#111827' }}>
              {OrderStatusLabels[order.status as DepotOrderStatus]}
            </Text>
          </View>
        </View>

        <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151' }}>
          Productos en el pedido: {order.items.length}
        </Text>
      </View>
      
      <ItemOrdersComponent
        pedidoItems={order.items.map(item => ({
          id: item.id,
          nombre: item.productName,
          marca : item.productBrand,
          marcado: item.isReady,
          embalaje: item.packaging, 
          cantidad: item.quantity,
        }))}
        operatorUserId={user.id}
        pedidoStatus={order.status}
      />

      
    </View>
  )
}

export default DetailOrderCard;