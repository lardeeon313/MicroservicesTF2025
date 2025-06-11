//LOGICA DE NEGOCIO , EN CASO DE QUE EL PEDIDO ESTE EN ISSEUED OSEA ARMADO O PREPARADO: 
import React, { useState } from "react";
import { ScrollView,Text, View } from "react-native";
import type { Order } from "../../../otherTypes/OrderType";
import { OrderStatus } from "../../../otherTypes/OrderType";
import ListofArmOrders from "../../components/listOrders/ListofArmOrders";
import NavbarOperator from "../../components/Navbar/NavbarOperator";
import { mockOrders } from "../../mock/MockOrders";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DepotStackParamList } from "../../types/DepotStackType";
//EJEMPLO DE USO DEL NAVBAR: 
// Simulamos autenticación y usuario:
const user = { name: 'Juan Pérez', role: 'Operario' };
const isAuthenticated = true;



const ListofOrdersArmPage = () => {
    const [orders,setOrders] = useState<Order[]>(mockOrders);
    //prepared = armado 
    const navigation = useNavigation<NativeStackNavigationProp<DepotStackParamList>>();

    const ArmOrders = orders.filter(
        order => order.status === OrderStatus.Prepared
    );
    
    return(
        <View style={{flex:1}}>
            <NavbarOperator user={user} isAuthenticated={isAuthenticated} logout={() => console.log("Cerrar sesión")}/>
            <ScrollView style={{padding:20}}>
                {ArmOrders.length === 0 ? (
                    <Text style={{ fontSize: 18 }}>No hay pedidos armados todavía.</Text>
                    ) : (
                ArmOrders.map((order) => (
                    <ListofArmOrders 
                        id={order.id}
                        customer={`${order.customer?.firstName} ${order.customer?.lastName}`}
                        key={order.id}
                        order={order}
                        onSeeDetail={() => navigation.navigate('DetailOrder',{order})}
                        />
                    ))
                )}
            </ScrollView>
        </View>
    )

}

export default ListofOrdersArmPage;