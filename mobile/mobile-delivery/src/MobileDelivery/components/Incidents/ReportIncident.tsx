import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { LogisticOrder } from "../../types/DeliveryOrderTypeDto";

type Props = {
  order: LogisticOrder;
  onSubmit: (notes: string) => void;
};

export default function ReportIncidentComponent({ order, onSubmit }: Props) {
  const [notes, setNotes] = useState("");

  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        shadowColor: "#000",
        elevation: 3,
        marginHorizontal: 16,
        marginTop: 24,
        marginBottom: 40,
      }}
    >
      {/* 👇 Imagen cargada con require */}
        <Image
            source={require("../../../assetsImages/LogoVerona.png")}
            style={{ width: 80, height: 80, alignSelf: "center", marginBottom: 16 }}
            resizeMode="contain"
        />

        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12, color: "#111" }}>
            Emitir notificacion del Incidente - Pedido #{order.id}
        </Text>

        <Text style={{ fontSize: 16, marginBottom: 4, color: "#333" }}>
            Cliente: {order.customer.firstName}{order.customer.lastName}
        </Text>

        <Text style={{ marginBottom: 6, fontWeight: "500", color: "#444" }}>
            Informar a Tesoreria:
        </Text>
        <Text style={{ marginBottom: 6, fontWeight: "500", color: "#444" }}>
            Detalle los incidentes con una breve descripcion:
        </Text>
      <TextInput
        value={notes}
        onChangeText={setNotes}
        placeholder="Coloque el texto aqui..."
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          padding: 12,
          marginBottom: 16,
          fontSize: 14,
          color: "#333",
        }}
        multiline
      />

      <TouchableOpacity
        style={{
          backgroundColor: "#EF4444",
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 10,
          alignItems: "center",
          alignSelf: "center",
          maxWidth: 250,
          width: "100%",
        }}
        onPress={() => onSubmit(notes)}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
          Enviar Incidente
        </Text>
      </TouchableOpacity>
    </View>
  );
}
