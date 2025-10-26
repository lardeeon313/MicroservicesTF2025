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
import { useAuth } from '../../Login/context/useAuth'; 
import Footer from '../../../components/Footer';
import GetBack from '../../../components/GetBack';
import { TeamDepotType } from '../../types/TeamType';


const ListOfConfirmedOrdersPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<DepotStackParamList>>();
  const { confirmedOrders: orders, loading, error } = useConfirmedOrders();

  const { userId, name, role, isAuthenticated, logout, team } = useAuth();
  
  const teamName = typeof team === 'object' ? team?.teamName : team;
  
  const user = userId && name && role
    ? { id: userId, name, role, team: teamName ?? null } 
    : null;

  const handleSeeDetail = (order: DepotOrderDTO) => {
    if (!user) return; 
    navigation.navigate('DetailOrder', {
      orderId: order.depotOrderId,
      operatorUserId: user.id, 
    });
  };

  const handleAcceptOrder = (order: DepotOrderDTO) => {
    navigation.navigate('AcceptOrder', {
      order: {
        ...order,
        
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

      <View style={{ marginTop: 10, marginLeft: 10}}>
        <GetBack/>
      </View>

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
      <Footer/>
    </View>
  );
};

export default ListOfConfirmedOrdersPage;
