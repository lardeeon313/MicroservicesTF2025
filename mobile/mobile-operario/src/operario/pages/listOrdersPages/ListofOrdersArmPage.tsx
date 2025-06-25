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
import { DepotOrderDTO, DepotOrderStatus } from "../../types/OrderDTO";
import { useArmOrders } from "../../hocks/useArmOrders";
//EJEMPLO DE USO DEL NAVBAR: 
// Simulamos autenticación y usuario:
const user = { name: 'Juan Pérez', role: 'Operario',id: 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa'  };
const isAuthenticated = true;

const ListofOrdersArmPage = () => {
    //prepared = armado 
    const navigation = useNavigation<NativeStackNavigationProp<DepotStackParamList>>();
    const {armOrders: orders, loading,error} = useArmOrders();
    //por las dudas se aplica filtro por el tema de la conversion de int a string; 
    const ArmOrders = orders.filter(
        order => order.status === DepotOrderStatus.InPreparation 
    );

    const handleSeeDetail = (order: DepotOrderDTO) => {
        navigation.navigate('DetailOrder', {
           orderId: order.depotOrderId,
           operatorUserId: user.id,
        });
    };

    const handleSendOrderToBill = (order: DepotOrderDTO) => {
        navigation.navigate('SendOrder', {
            orderId: order.depotOrderId
        })
    }
    

    if (loading) {
        return <Text style={{ padding: 16 }}>Cargando pedidos...</Text>;
    }
    
    if (error) {
        return <Text style={{ padding: 16, color: 'red' }}>Error: {error.message}</Text>;
    }
    
    
    return(
        <View style={{flex:1}}>
            <NavbarOperator user={user} isAuthenticated={isAuthenticated} logout={() => console.log("Cerrar sesión")}/>
            <ScrollView style={{padding:20}}>
                {ArmOrders.length === 0 ? (
                    <Text style={{ fontSize: 18 }}>No hay pedidos armados todavía.</Text>
                    ) : (
                ArmOrders.map((order) => (
                    <ListofArmOrders 
                        id={order.depotOrderId}
                        customer= {order.customerEmail}
                        key={order.depotOrderId}
                        order={order}
                        onSeeDetail={() => handleSeeDetail(order)}
                        onSendToBill={() => handleSendOrderToBill(order)}
                        />
                    ))
                )}
            </ScrollView>
        </View>
    )

}

export default ListofOrdersArmPage;