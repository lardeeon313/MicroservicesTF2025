import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { ShoppingCart, PackageCheck, AlertTriangle,Check  } from "lucide-react-native";
import { DepotStackParamList } from "../types/DepotStackType";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useMissingOrders } from "../hocks/useMissingOrders";


import { useAuth } from "../Login/context/useAuth";

type CardItem = {
  title: string;
  description: string;
  icon: React.ElementType;
  path: keyof DepotStackParamList;
};

const cards: CardItem[] = [
  {
    title: 'Pedidos confirmados',
    description: 'Consulta los pedidos asignados para confirmar o rechazar dichos pedidos.',
    icon: PackageCheck,
    path: 'ConfirmedOrders',
  },
  {
    title: 'Pedidos con faltantes',
    description: 'Visualiza los pedidos que tienes y emite los faltantes necesarios.',
    icon: AlertTriangle,
    path: 'MissingOrders',
  },
  {
    title: 'Pedidos en Preparación',
    description: 'Aquí encontrarás los pedidos que ya han sido confirmados y que tienen todos sus productos. Selecciónalos para prepararlos.',
    icon: ShoppingCart,
    path: 'ArmOrders',
  },
  {
    title: 'Pedidos armados',
    description: 'Manda los pedidos preparados para facturarlos.',
    icon: Check,
    path:'PreparedOrders'
  },
];

const OperatorDashboardComponent = () => {
  const { userId } = useAuth();

  const user = { id: userId!};
  
  const { missingOrders, loading } = useMissingOrders(user.id);
  const navigation = useNavigation<NativeStackNavigationProp<DepotStackParamList>>();

  return(
    <View style={{ flex: 1, padding: 16, backgroundColor: '#ffffff' }}>
      {cards.map((card,index) => (
        <TouchableOpacity key={index} style={{backgroundColor: '#FFFFFF',borderRadius: 12,padding: 20,marginBottom: 16,shadowColor: '#000',shadowOpacity: 0.08,shadowOffset: { width: 0, height: 4 },shadowRadius: 10,elevation: 3}}
        onPress={() => {
          switch(card.path){
            case 'ConfirmedOrders':
              navigation.navigate('ConfirmedOrders');
              break;
            case 'MissingOrders':
              if (missingOrders.length > 0) {
                const order = missingOrders[0]; 
                navigation.navigate('MissingOrders', {
                  id: order.depotOrderId,
                  customer: order.customerName,
                  status: order.status,
                  missingCount: order.missings,
                  onVerDetalle: () => {}, 
                  onEmitirFaltante: () => {}, 
                  onMarcarArmado: () => {}, 
                  onNotifySecction: () => {}, 
                  });
                } else {
                  Alert.alert("No hay pedidos con faltantes");
                }
            break;
            case 'ArmOrders':
              navigation.navigate('ArmOrders');
            break;
            case 'PreparedOrders':
              navigation.navigate('PreparedOrders')
            break;
          }
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <card.icon size={24} color="#8b0000" style={{ marginRight: 16 }} />
            <View style={{flex: 1}}>
              <Text style={{ fontSize: 18, fontWeight: '600',color:'#111827' }}>{card.title}</Text>
              <Text style={{ fontSize:14,color: '#6B7280',marginTop:4 }}>{card.description}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default OperatorDashboardComponent;