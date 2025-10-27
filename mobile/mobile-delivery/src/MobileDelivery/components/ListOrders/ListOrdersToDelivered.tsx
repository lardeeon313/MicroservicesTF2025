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
<<<<<<< HEAD
=======

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    overflow: 'hidden',
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  orderId: { 
    fontSize: 18, 
    fontWeight: "bold",
    color: '#1f2937',
  },
  urgentBadge: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  urgentText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  infoSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '500',
    width: 100,
    flexShrink: 0,
  },
  value: {
    fontSize: 20,
    color: '#1f2937',
    flex: 1,
  },
  addressValue: {
    fontSize: 15,
    color: '#1f2937',
    fontWeight: '600',
    flex: 1,
  },
  priorityValue: {
    fontSize: 15,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  actionsSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailButton: {
    backgroundColor: "#3B82F6",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: 'center',
  },
});
>>>>>>> aa9e73b (Desarrollo del mobile-delivery: implementación del código de Docker para que funcione con los demás microservicios, implementación de todos los endpoints del backend del mobile-delivery, cambios realizados en los Command Handler y en el código de Infrastructure de LogisticOrderRepository (había muchos filtros que impedían incluso traer pedidos))
