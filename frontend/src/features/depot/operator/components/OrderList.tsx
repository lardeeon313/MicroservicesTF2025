import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Order } from "../../../sales/types/OrderTypes";

interface Props {
    orders: Order[],
    loading: boolean,
}

const OrderListComponent = ({orders,loading}: Props) => {
    
    const renderItem = ({item}: {item:Order}) => (
        <TouchableOpacity>
            <Text >Cliente: {item.customerFirstName}{item.customerLastName}</Text>
            <Text>Direccion: {item.deliveryDetail} </Text>
            <Text>Estado: {item.status} </Text>
            <Text>Fecha del pedido: {item.orderDate} </Text>
        </TouchableOpacity>
    ); 

    if(loading){
        return(
            <View>
                <ActivityIndicator size="large" color="#007AFF"/>
                <Text>Cargando pedidos....</Text>
            </View>
        )
    }
    return(
        <FlatList 
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        />
    )
}

export default OrderListComponent;