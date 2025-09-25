import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

type Props = {
  id: number;
  customer: string;
  address: string;
  status: string;
  priority: string;
  onConfirm: () => void;
  onReject: ()=> void;
  onSeeDetail: () => void;
};

export default function ListOrdersToDistributeComponent({
  id,
  customer,
  address,
  status,
  priority,
  onConfirm,
  onReject,
  onSeeDetail,
}: Props) {
  const isUrgent = priority === "HIGH";
  const isActionCompleted = status === "CONFIRM" || status === "PENDING_CONFIRM";

  console.log(`Pedido ${id} tiene estado: ${status}`); // Debugging

  return (
    <View
      style={{
        backgroundColor: isUrgent ? "#fff5f5" : "#ffffff",
        padding: 20,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: "#000",
        elevation: 4,
        borderWidth: isUrgent ? 1.5 : 0,
        borderColor: isUrgent ? "#e11d48" : "transparent",
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Pedido #{id}</Text>
      <Text style={{ fontSize: 20, fontWeight: "300", marginTop: 4 }}>
        Cliente: {customer}
      </Text>
      <Text style={{ marginTop: 4, fontSize: 20 }}>Dirección: {address}</Text>
      <Text style={{ marginTop: 4, fontSize: 20 }}>Estado: {status}</Text>
      <Text
        style={{
          fontSize: 13,
          fontStyle: "italic",
          color: isUrgent ? "#b91c1c" : "gray",
        }}
      >
        Prioridad: {priority}
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          marginTop: 12,
          gap: 4,
        }}
      >
        {!isActionCompleted && (
          <>
            <TouchableOpacity
              style={{
                backgroundColor: "#4a9c13ff",
                padding: 8,
                borderRadius: 8,
              }}
              onPress={onConfirm}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#e41616ff",
                padding: 8,
                borderRadius: 8,
              }}
              onPress={onReject}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Rechazar</Text>
            </TouchableOpacity>
          </>
        )}
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