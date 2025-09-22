import React , { useState, useEffect }from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { MapPin, CheckCircle, AlertTriangle,Check  } from "lucide-react-native";

type CardItem = {
  title: string;
  description: string;
  icon: React.ElementType;
  path: undefined; //solo por el momento
};

const cards: CardItem[] = [
  {
    title: 'Pedidos para repartir',
    description: 'Visualiza todos los pedidos que ya has confirmado dependiendo de la zona.',
    icon: MapPin,
    path: undefined,
    
  },
  {
    title: 'Pedidos entregados',
    description: 'Consulta todos los pedidos que ya han sido entregados',
    icon: CheckCircle,
    path: undefined,
    
  },
  {
    title: 'Pedidos con incidentes',
    description: 'Revisa todos los pedidos que hayan tenido incidentes durante el trayecto o depsues del mismo .',
    icon: AlertTriangle,
    path: undefined,
  },
];

const DeliveryDashboardComponent = () => {
    return(
        <View style={{ flex: 1, padding: 16, backgroundColor: '#ffffff' }}>
            {cards.map((card,index) => (
                <TouchableOpacity key={index} style={{backgroundColor: '#FFFFFF',borderRadius: 12,padding: 20,marginBottom: 16,shadowColor: '#000',shadowOpacity: 0.08,shadowOffset: { width: 0, height: 4 },shadowRadius: 10,elevation: 3}}
                onPress={() =>{

                }
                }>
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

export default DeliveryDashboardComponent;