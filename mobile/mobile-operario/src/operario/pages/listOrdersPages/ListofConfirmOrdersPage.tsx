import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { DepotStackParamList } from '../../types/DepotStackType';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ListofConfirmedOrders from '../../components/listOrders/ListofConfirmedOrders';
import { useConfirmedOrders } from '../../hocks/useConfirmedOrders';
import type { DepotOrderDTO } from '../../types/OrderDTO';
import { OrderStatusMap, DepotOrderStatus } from '../../types/OrderDTO';
import NavbarOperator from '../../components/Navbar/NavbarOperator';
import { useAuth } from '../../../Login/context/useAuth'; // 👈 usamos auth real


const ListOfConfirmedOrdersPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<DepotStackParamList>>();
  const { confirmedOrders: orders, loading, error } = useConfirmedOrders();

  // 👇 traemos todo desde el contexto de auth
  const { userId, name, role, isAuthenticated, logout } = useAuth();

  // armamos el objeto user solo si existe
  const user = userId && name && role ? { id: userId, name, role } : null;

  const handleSeeDetail = (order: DepotOrderDTO) => {
    if (!user) return; // seguridad extra
    navigation.navigate('DetailOrder', {
      orderId: order.depotOrderId,
      operatorUserId: user.id, // 👈 ahora va el userId real del auth
    });
  };

  const handleAcceptOrder = (order: DepotOrderDTO) => {
    navigation.navigate('AcceptOrder', {
      order: {
        ...order,
        // si tu backend separa nombre y apellido, lo ajustás acá
        customerName: order.customerName.split(' ')[1] ?? '',
      },
    });
  };

  if (loading) {
    return <Text style={{ padding: 16 }}>Cargando pedidos...</Text>;
  }

  if (error) {
    return <Text style={{ padding: 16, color: 'red' }}>Error: {error.message}</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <NavbarOperator 
        user={user} 
        isAuthenticated={isAuthenticated} 
        logout={logout} 
      />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ 
          fontSize: 22, 
          fontWeight: '600', 
          marginBottom: 20, 
          color: '#333', 
          letterSpacing: 0.5, 
          textAlign: 'center'
        }}>
          Pedidos para poder confirmar  
        </Text>

        { orders.length === 0 ? (
          <Text style={{ fontSize: 18 ,textAlign:'center'}}>
            No hay pedidos para confirmar aun.
          </Text>
        ) : (
          orders.map((order) => (
            <ListofConfirmedOrders
              key={order.depotOrderId}
              order={order}
              customer={order.customerName}
              status={OrderStatusMap[order.status] ?? DepotOrderStatus.Assigned}
              onSeeDetail={() => handleSeeDetail(order)}
              onAceeptOrder={() => handleAcceptOrder(order)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default ListOfConfirmedOrdersPage;
