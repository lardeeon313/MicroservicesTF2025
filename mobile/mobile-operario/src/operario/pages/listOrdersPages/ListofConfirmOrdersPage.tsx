import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { DepotStackParamList } from '../../types/DepotStackType';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ListofConfirmedOrders from '../../components/listOrders/ListofConfirmedOrders';
import { actualizarEstadoPedido } from '../../hocks/actions/updateStatusOrder';
import NavbarOperator from '../../components/Navbar/NavbarOperator';
//IMPORANTE , SE DEBE IMPORTAR EL VIEW De REACT NATIVE , no el del lucide 
import { View , Text} from 'react-native';
//SE utiliza el hock para la vinculacion con el back: 
import { useConfirmedOrders } from '../../hocks/useConfirmedOrders';
import type { DepotOrderDTO } from '../../types/OrderDTO';
import { OrderStatusMap } from '../../types/OrderDTO';
import { DepotOrderStatus } from '../../types/OrderDTO';
import { DepotTeamAssigment } from '../../types/OrderDTO';



//EJEMPLO DE USO DEL NAVBAR: 
// Simulamos autenticación y usuario:
const user = { name: 'Juan Pérez', role: 'Operario' , id: 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa' };
const isAuthenticated = true;


const ListOfConfirmedOrdersPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<DepotStackParamList>>();
  //const {user,isAuthenticated} = useAuth();
  const { confirmedOrders: orders, loading, error } = useConfirmedOrders();

  // Cambiar tipo de Order a BackendOrder
  const handleSeeDetail = (order: DepotOrderDTO) => {
    //filtra que tenga el rol de operator 
     
    navigation.navigate('DetailOrder', {
       orderId: order.depotOrderId,
       operatorUserId: user.id,
    });
  };

  const handleAcceptOrder = (order: DepotOrderDTO) => {
    navigation.navigate('AcceptOrder', {
      order: {
        ...order,
        // No hay customerFirstName ni customerLastName, si necesitás dividirlo hacelo acá
        //customerEmail: order.customerName.split(' ')[0] ?? '',
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
      <NavbarOperator user={user} isAuthenticated={isAuthenticated} logout={() => console.log("Cerrar sesión")} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 22,fontWeight: '600',marginBottom: 20,color: '#333', letterSpacing: 0.5, textAlign: 'center'}}>
          Pedidos para poder confirmar  
        </Text>
        { orders.length === 0? (
          <Text style={{ fontSize: 18 ,textAlign:'center'}}>No hay pedidos para confirmar aun.</Text>
        ) : (
        orders.map((order) => (
          <ListofConfirmedOrders
            key={order.depotOrderId}
            order={order}
            customer={order.customerName} // Usar directamente el nombre completo
            status={OrderStatusMap[order.status] ?? DepotOrderStatus.Assigned} // En BackendOrder es número, ListofConfirmedOrders espera string
            onSeeDetail={() => handleSeeDetail(order)}
            onAceeptOrder={() => handleAcceptOrder(order)}
          />
        )))}
      </ScrollView>
    </View>
  );
};

export default ListOfConfirmedOrdersPage;