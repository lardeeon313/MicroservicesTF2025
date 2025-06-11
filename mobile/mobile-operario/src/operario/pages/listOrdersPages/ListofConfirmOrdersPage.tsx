import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { DepotStackParamList } from '../../types/DepotStackType';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ListofConfirmedOrders from '../../components/listOrders/ListofConfirmedOrders';
import { actualizarEstadoPedido } from '../../hocks/actions/updateStatusOrder';
import type { Order} from '../../../otherTypes/OrderType';
import { OrderStatus } from '../../../otherTypes/OrderType';
import NavbarOperator from '../../components/Navbar/NavbarOperator';
import { mockOrders } from '../../mock/MockOrders';
//IMPORANTE , SE DEBE IMPORTAR EL VIEW De REACT NATIVE , no el del lucide 
import { View } from 'react-native';


//EJEMPLO DE USO DEL NAVBAR: 
// Simulamos autenticación y usuario:
const user = { name: 'Juan Pérez', role: 'Operario' };
const isAuthenticated = true;


const ListOfConfirmedOrdersPage = () => {
    const navigation = useNavigation<NativeStackNavigationProp<DepotStackParamList>>();

    //MockDatos por las dudas : 
    const [orders,setOrders] = useState<Order[]>(mockOrders);

    const handleSeeDetail = (order: Order) => {
        console.log('Detalle del pedido:', order);
        navigation.navigate('DetailOrder', { order });
    }

    const handleAcceptOrder = (order: Order) => {

       navigation.navigate("AcceptOrder",{
        order: {
            ...order,
            customerFirstName: order.customerFirstName,
            customerLastName: order.customerLastName,
        }
       })
    };

    const filterOrders = orders.filter(
      order => (order.status === OrderStatus.Confirmed || order.status === OrderStatus.Pending) 
    )

    return(
      <View style={{flex:1}}>
        <NavbarOperator user={user} isAuthenticated={isAuthenticated} logout={() => console.log("Cerrar sesión")}/>
          <ScrollView style={{padding:16}}>
            {filterOrders.map(order => (
                <ListofConfirmedOrders
                key={order.id}
                order={order}
                customer={`${order.customer?.firstName} ${order.customer?.lastName}`}
                status={order.status}
                onSeeDetail={() => handleSeeDetail(order)}
                onAceeptOrder={() => handleAcceptOrder(order)}
                />
            ))}
        </ScrollView>
      </View>
    )
}

export default ListOfConfirmedOrdersPage;
// Este componente muestra una lista de pedidos confirmados y permite ver detalles y aceptar pedidos.
