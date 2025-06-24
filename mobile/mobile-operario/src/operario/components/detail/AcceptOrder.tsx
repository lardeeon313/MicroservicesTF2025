import React from "react";
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import type { DepotOrderDTO, DepotOrderStatus } from "../../types/OrderDTO";
import { OrderStatusLabels } from "../../constants/UseStatusOrderOperator";

type Props = {
  order:DepotOrderDTO;
  onAccept: () => void;
  onReject: () => void;
}

const AcceptOrder = ({order, onAccept, onReject}: Props) => {
  console.log("LOG de los productos:", order);
  return(
    <ScrollView style={{ padding: 20, backgroundColor: '#fff', flexGrow: 1 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>
        Pedido: {order.depotOrderId}
      </Text>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        Cliente: {`${order.customerName}`}
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
        Estado: {OrderStatusLabels[order.status as DepotOrderStatus]}
      </Text>

      <View style={{ marginTop: 30, gap: 15 }}>
        <Button title="Aceptar" onPress={onAccept} color="#28a745" />
        <Button title="Rechazar" onPress={onReject} color="#dc3545" />
      </View>
    </ScrollView>
  )
}

export default AcceptOrder;