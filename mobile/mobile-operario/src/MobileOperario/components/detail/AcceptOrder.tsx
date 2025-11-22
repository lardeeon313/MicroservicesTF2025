import React from "react";
import { View, Text, Button, StyleSheet, ScrollView,TouchableOpacity } from 'react-native';
import type { DepotOrderDTO, DepotOrderStatus } from "../../types/OrderDTO";
import { OrderStatusLabels } from "../../constants/UseStatusOrderOperator";
import { PackageCheck, UserRound, Package, Info } from 'lucide-react-native';


type Props = {
  order:DepotOrderDTO;
  onAccept: () => void;
  onReject: () => void;
}

const AcceptOrder = ({order, onAccept, onReject}: Props) => {
  console.log("LOG de los productos:", order);
  return (
  <ScrollView style={{padding: 24,backgroundColor: '#f9f9f9',flexGrow: 1,}}>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
      <PackageCheck size={22} color="#333" style={{ marginRight: 8 }} />
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333' }}>
          Pedido: {order.depotOrderId}
        </Text>
    </View>

    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <UserRound size={20} color="#555" style={{ marginRight: 8 }} />
        <Text style={{ fontSize: 18, color: '#555' }}>
          Cliente: {order.customerEmail}
        </Text>
    </View>


    <View style={{ alignItems: 'flex-start', marginBottom: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Package size={20} color="#222" style={{ marginRight: 8 }} />
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#222' }}>
          Productos:
          </Text>
      </View>

      {order.items?.map((producto, index) => (
        <Text
          key={index}
          style={{
            fontSize: 16,
            marginBottom: 4,
            color: '#444',
            textAlign: 'center',
          }}
        >
          • {producto.productName} , {producto.productBrand} x {producto.quantity}
        </Text>
      ))}

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 24 }}>
        <Info size={20} color="#007bff" style={{ marginRight: 8 }} />
        <Text
          style={{
            fontSize: 18,
            fontWeight: '500',
            color: '#007bff',
            textAlign: 'center',
          }}
        >
          Estado: {OrderStatusLabels[order.status as DepotOrderStatus]}
        </Text>
      </View>
    </View>

      <View style={{marginTop: 30,gap: 16,}}>
      <TouchableOpacity
        onPress={onAccept}
        style={{
          backgroundColor: '#28a745',
          paddingVertical: 14,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Aceptar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onReject}
        style={{
          backgroundColor: '#dc3545',
          paddingVertical: 14,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Rechazar</Text>
      </TouchableOpacity>
    </View>

    </ScrollView>
  );

}

export default AcceptOrder;