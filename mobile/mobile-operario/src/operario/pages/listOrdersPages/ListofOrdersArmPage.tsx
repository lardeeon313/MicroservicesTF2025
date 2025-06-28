//LOGICA DE NEGOCIO , EN CASO DE QUE EL PEDIDO ESTE EN ESTADO DE EN PREPARACION: 
import React, { useState , useEffect} from "react";
import {Alert, ScrollView,Text, View } from "react-native";
import ListofArmOrders from "../../components/listOrders/ListofArmOrders";
import NavbarOperator from "../../components/Navbar/NavbarOperator";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DepotStackParamList } from "../../types/DepotStackType";
import { DepotOrderDTO, DepotOrderStatus } from "../../types/OrderDTO";
import { useArmOrders } from "../../hocks/useArmOrders";
import { useSendOrderToBilled } from "../../hocks/useSendOrderToBilled";


//EJEMPLO DE USO DEL NAVBAR: 
// Simulamos autenticación y usuario:
const user = { name: 'Juan Pérez', role: 'Operario',id: 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa'  };
const isAuthenticated = true;

const ListofOrdersArmPage = () => {
    //prepared = armado 
    const navigation = useNavigation<NativeStackNavigationProp<DepotStackParamList>>();
    const {armOrders: orders, loading,error} = useArmOrders(user.id);
    const { SendOrder, loading: sending } = useSendOrderToBilled();
    const [localOrders,setlocalOrders] = useState<DepotOrderDTO[]>([]);
    
    useEffect(() => {
        setlocalOrders(orders);
    }, [orders]);
    //por las dudas se aplica filtro por el tema de la conversion de int a string; 
    const ArmOrders = localOrders.filter(
        order =>
            order.status === DepotOrderStatus.InPreparation || 
            order.status === DepotOrderStatus.SentToBilling
    );
    //VER DETALLE
    const handleSeeDetail = (order: DepotOrderDTO) => {
        navigation.navigate('DetailOrder', {
           orderId: order.depotOrderId,
           operatorUserId: user.id,
        });
    };
    //ENVIAR EL PEDIDO A FACTURAR 
    const handleSendOrderToBill = async(order: DepotOrderDTO) => {
        const result = await SendOrder(order.depotOrderId);
        if (result.ok) {
            Alert.alert("¡Éxito!", "El pedido fue enviado a facturación correctamente.");
            //Cuando manda a facturar , el pedido cambio su estado a SendToBilling 
            setlocalOrders(prev => 
                prev.map(or => 
                    or.depotOrderId === order.depotOrderId
                    ?  { ...or, status: DepotOrderStatus.SentToBilling}
                    : or
                )
            );
        } else {
            Alert.alert("Error", result.error || "Ocurrió un error al enviar a facturar.");
        }
    };
    

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
                        customer= {order.customerName}
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