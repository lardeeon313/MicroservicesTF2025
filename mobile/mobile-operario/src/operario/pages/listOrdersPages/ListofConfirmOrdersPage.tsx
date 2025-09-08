import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { DepotStackParamList } from '../../types/DepotStackType';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ListofConfirmedOrders from '../../components/listOrders/ListofConfirmedOrders';
import { actualizarEstadoPedido } from '../../hocks/actions/updateStatusOrder';
import NavbarOperator from '../../components/Navbar/NavbarOperator';
import { View , Text} from 'react-native';
import { useConfirmedOrders } from '../../hocks/useConfirmedOrders';
import type { DepotOrderDTO } from '../../types/OrderDTO';
import { OrderStatusMap } from '../../types/OrderDTO';
import { DepotOrderStatus } from '../../types/OrderDTO';
import { DepotTeamAssigment } from '../../types/OrderDTO';
import { useAuth } from "../../../Login/context/useAuth";
import { useSendOrderToBilled } from '../../hocks/useSendOrderToBilled';

export default function ListofConfirmOrdersPage() {
  const { userId, name, role } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<DepotStackParamList>>();
  
  // Validar que userId no sea null
  if (!userId) {
    return <Text style={{ padding: 16, color: 'red' }}>Usuario no autenticado</Text>;
  }
  
  const { confirmedOrders: orders, loading, error } = useConfirmedOrders();
  const { SendOrder } = useSendOrderToBilled();
  const [localOrders, setLocalOrders] = useState<DepotOrderDTO[]>([]);

  // Cambiar tipo de Order a BackendOrder
  const handleSeeDetail = (order: DepotOrderDTO) => {
    navigation.navigate('DetailOrder', {
       orderId: order.depotOrderId,
       operatorUserId: userId,
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
        user={{ name: name || 'Operario', role: role || 'Operario' }} 
        isAuthenticated={true} 
        logout={() => console.log("Cerrar sesión")} 
      />
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
            customer={order.customerName}
            status={OrderStatusMap[order.status] ?? DepotOrderStatus.Assigned}
            onSeeDetail={() => handleSeeDetail(order)}
            onAceeptOrder={() => handleAcceptOrder(order)}
          />
        )))}
      </ScrollView>
    </View>
  );
}