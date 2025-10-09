import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LogisticOrder } from "../../types/DeliveryOrderTypeDto";

type Props = {
  order: LogisticOrder;
  onSeeDetail: () => void;
};

export default function ListOrdersToVerifiedComponent({ order, onSeeDetail }: Props) {
  return (
    <View
      style={{
        backgroundColor: "#ffffff",
        padding: 20,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: "#000",
        elevation: 4,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Pedido #{order.id}</Text>

      <Text style={{ fontSize: 18, marginTop: 4 }}>
        Cliente: {`${order.customer.firstName} ${order.customer.lastName}`}
      </Text>

      <Text style={{ marginTop: 4, fontSize: 16 }}>
        Dirección: {`${order.deliveryAddress.street} ${order.deliveryAddress.number}, ${order.deliveryAddress.city}`}
      </Text>

      <Text style={{ marginTop: 4, fontSize: 16 }}>Estado: {order.status}</Text>

      <Text style={{ fontSize: 13, fontStyle: "italic", color: "gray" }}>
        Prioridad: {order.priority}
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          marginTop: 12,
          gap: 4,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#3B82F6",
            padding: 8,
            borderRadius: 8,
          }}
          onPress={onSeeDetail}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Ver Detalle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
