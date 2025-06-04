import React from "react";
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import type { Order } from "../../../otherTypes/OrderType";

type Props = {
  order:Order;
  onAccept: () => void;
  onReject: () => void;
}

const AcceptOrder: React.FC<Props> = ({order, onAccept, onReject}) => {
  return(
    <ScrollView style={{ padding: 20, backgroundColor: '#fff', flexGrow: 1 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>
        Pedido: {order.id}
      </Text>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        Cliente: {order.customerFirstName} {order.customerLastName}
      </Text>

      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10 }}>
        Productos:
      </Text>
      {order.items?.map((producto, index) => (
        <Text key={index} style={{ fontSize: 16, marginBottom: 5 }}>
          - {producto.productName} x {producto.quantity}
        </Text>
      ))}

      <Text style={{ fontSize: 20, marginBottom: 12 }}>
        Estado: {order.status}
      </Text>

      <View style={{ marginTop: 30, gap: 15 }}>
        <Button title="Aceptar" onPress={onAccept} color="#28a745" />
        <Button title="Rechazar" onPress={onReject} color="#dc3545" />
      </View>
    </ScrollView>
  )
}

export default AcceptOrder;