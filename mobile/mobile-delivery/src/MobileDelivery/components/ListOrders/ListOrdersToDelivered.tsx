import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import RenderOrderModal from "../RenderOrder/RenderOrderModal";

type Props = {
  id: number;
  customer: string;
  address: string;
  status: string;
  priority: string;
  payment: "CASH" | "TRANSFER" | "ACCOUNT"; // 👈 nuevo campo
  onSeeDetail: () => void;
  onPaymentType: () => void;
  onRenderOrder: (orderId: number) => void;
};

export default function ListOrdersToDeliveredComponent({
  id,
  customer,
  address,
  status,
  priority,
  payment, // 👈 lo recibimos
  onSeeDetail,
  onPaymentType,
  onRenderOrder,
}: Props) {
  const [showModal, setShowModal] = useState(false);

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
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
        Pedido #{id}
      </Text>
      <Text style={{ fontSize: 20, fontWeight: "300", marginTop: 4 }}>
        Cliente: {customer}
      </Text>
      <Text style={{ marginTop: 4, fontSize: 20 }}>Dirección: {address}</Text>
      <Text style={{ marginTop: 4, fontSize: 20 }}>Estado: {status}</Text>
      <Text style={{ fontSize: 13, fontStyle: "italic", color: "gray" }}>
        Prioridad: {priority}
      </Text>
      <Text style={{ marginTop: 4, fontSize: 16, color: "#444" }}>
        Método de pago: {payment}
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          marginTop: 12,
          gap: 4,
        }}
      >
        {/* Ver detalle */}
        <TouchableOpacity
          style={{
            backgroundColor: "#3B82F6",
            padding: 8,
            borderRadius: 8,
          }}
          onPress={onSeeDetail}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            Ver Detalle
          </Text>
        </TouchableOpacity>

        {/* Si es efectivo -> botón de rendición */}
        {payment === "CASH" && (
          <TouchableOpacity
            style={{
              backgroundColor: "#F59E0B",
              padding: 8,
              borderRadius: 8,
            }}
            onPress={() => setShowModal(true)}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Rendir Pedido
            </Text>
          </TouchableOpacity>
        )}

        {/* Si es transferencia o cuenta corriente -> botón de confirmar pago */}
        {(payment === "TRANSFER" || payment === "ACCOUNT") && (
          <TouchableOpacity
            style={{
              backgroundColor: "#4CAF50",
              padding: 8,
              borderRadius: 8,
            }}
            onPress={onPaymentType}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Confirmar Pago
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Modal de rendición */}
      <RenderOrderModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          onRenderOrder(id);
          setShowModal(false);
        }}
      />
    </View>
  );
}
