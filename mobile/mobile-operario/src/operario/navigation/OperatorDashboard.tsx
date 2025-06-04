
// This component serves as the main dashboard for the operator, providing quick access to different sections of the app.

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ShoppingCart, PackageCheck, AlertTriangle } from "lucide-react-native";
import { DepotStackParamList } from "../types/DepotStackType";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";


type CardItem = {
  title: string;
  description: string;
  icon: React.ElementType;
  path: keyof DepotStackParamList;
};

const cards: CardItem[] = [
  {
    title: 'Pedidos armados',
    description: 'Visualiza los pedidos ya preparados para facturar',
    icon: ShoppingCart,
    path: 'ArmOrders',
  },
  {
    title: 'Pedidos confirmados',
    description: 'Consulta los pedidos que confirmaste y confirma otros pedidos nuevos',
    icon: PackageCheck,
    path: 'ConfirmedOrders',
  },
  {
    title: 'Pedidos con faltantes',
    description: 'Revisa y alertá los pedidos con faltantes',
    icon: AlertTriangle,
    path: 'MissingOrders',
  },
];

const OperatorDashboardComponent = () => {
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
              navigation.navigate('MissingOrders');
              break;
            case 'ArmOrders':
              navigation.navigate('ArmOrders');
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