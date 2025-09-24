import React from "react";
import { View, Text, StyleSheet, TouchableOpacity,Image } from "react-native";
import { DeliveryOrderTypeDto } from "../../types/DeliveryOrderTypeDto";

type Props = {
  order: DeliveryOrderTypeDto;
  onBack: () => void;
};

export default function DetailOrderComponent({ order, onBack }: Props) {
  return (
    <View style={{flex: 1, backgroundColor: '#f9f9f9', padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        <Image
          source={require('../../../assetsImages/LogoVerona.png')}
          style={{
            width: 42,
            height: 42,
            resizeMode: 'contain',
            marginRight: 10,
          }}
        />
      </View>

      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 12 }}>
          Detalle del Pedido #{order.id}
      </Text>

      <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 16, elevation: 2 }}> 
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
          Pedido#: {order.id}
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 4 }}>
          Cliente: {order.customer}
        </Text>
        <Text style={{ fontSize: 20, marginBottom: 4 }}>
          Dirección: {order.address}
        </Text>
        <Text style={{ fontSize: 20, marginBottom: 12 }}>
          Estado: {order.status}
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 4}}>
          Pago: {order.payment}
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 4}}>
          Prioridad: {order.priority}
        </Text>
      </View>


    </View>
  );
}
