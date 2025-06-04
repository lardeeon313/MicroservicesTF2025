//Logica de nogicio sobre la página de notificaciones del operador
import React from 'react';
import { View, Text, StyleSheet } from "react-native";
import NotificacionSection from '../../components/Notification/NotifactionSection';
import type { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import type { DepotStackParamList } from '../../types/DepotStackType';
import type { Missing } from '../../types/Missing';
import { getMockMissingItems } from '../../mock/MockMissingItems';
import NavbarOperator from '../../components/Navbar/NavbarOperator';


//EJEMPLO DE USO DEL NAVBAR: 
// Simulamos autenticación y usuario:
const user = { name: 'Juan Pérez', role: 'Operario' };
const isAuthenticated = true;



const NotificationSectionPage = () => {
    const {params} = useRoute<RouteProp<DepotStackParamList, "NotificationPage">>();
    const {order} = params;

    const missingItems = getMockMissingItems(order);

    //render:
    return(
        <View style={{flex:1}}>
            <NavbarOperator user={user} isAuthenticated={isAuthenticated} logout={() => console.log("Cerrar sesión")}/>
            <View style={{flex: 1,padding:16, backgroundColor: "#fff"}}>
                <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>Faltantes del Pedido#: {order.id}</Text>
                <NotificacionSection missingItems={missingItems} />
            </View>
        </View>
    )
}

export default NotificationSectionPage;