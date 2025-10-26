import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import RenderOrderModal from "../RenderOrder/RenderOrderModal";
import { LogisticOrder, PaymentType, OrderStatus } from "../../types/DeliveryOrderTypeDto";

type Props = {
  order: LogisticOrder;
  onSeeDetail: () => void;
  onPaymentType: () => void; // función genérica para actualizar estado
  onRenderOrder: (orderId: number) => void; // rendición de efectivo
};

export default function ListOrdersToDeliveredComponent({
  order,
  onSeeDetail,
  onPaymentType,
  onRenderOrder,
}: Props) {
  const [showModal, setShowModal] = useState(false);

  // función para manejar alert de pago según tipo
  const handlePaymentAction = () => {
    switch (order.paymentType) {
      case PaymentType.Transfer:
      case PaymentType.Credit_Card:
      case PaymentType.Debit_Card:
        Alert.alert("Pago confirmado", `Pago de ${order.paymentType} confirmado`, [
          { text: "OK", onPress: () => onPaymentType() },
        ]);
        break;

      case PaymentType.Current_Account:
        Alert.alert(
          "Cuenta corriente confirmada",
          `Pedido #${order.id} confirmado por cuenta corriente`
        );
        break;

      case PaymentType.Check:
        Alert.alert(
          "Cheque confirmado",
          `Pedido #${order.id} confirmado con cheque`
        );
        break;

      case PaymentType.Promissory_Note:
        Alert.alert(
          "Nota promissoria confirmada",
          `Pedido #${order.id} confirmado con nota promissoria`
        );
        break;

      default:
        break;
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Pedido #{order.id}</Text>
      <Text style={styles.customer}>
        Cliente: {order.customer.firstName} {order.customer.lastName}
      </Text>
      <Text style={styles.address}>
        Dirección: {order.deliveryAddress.street} {order.deliveryAddress.number},{" "}
        {order.deliveryAddress.city}
      </Text>
      <Text style={styles.status}>Estado: {order.status}</Text>
      <Text style={styles.priority}>Prioridad: {order.priority}</Text>
      <Text style={styles.paymentType}>Método de pago: {order.paymentType}</Text>

      <View style={styles.buttonsRow}>
        {/* Ver detalle */}
        <TouchableOpacity style={styles.buttonBlue} onPress={onSeeDetail}>
          <Text style={styles.buttonText}>Ver Detalle</Text>
        </TouchableOpacity>

        {/* Efectivo → rendición */}
        {order.paymentType === PaymentType.Cash && (
          <TouchableOpacity
            style={styles.buttonOrange}
            onPress={() => setShowModal(true)}
          >
            <Text style={styles.buttonText}>Rendir Pedido</Text>
          </TouchableOpacity>
        )}

        {/* Transfer, tarjetas, cuenta, cheque, nota → confirmaciones */}
        {order.paymentType !== PaymentType.Cash && (
          <TouchableOpacity style={styles.buttonGreen} onPress={handlePaymentAction}>
            <Text style={styles.buttonText}>
              {(() => {
                switch (order.paymentType) {
                  case PaymentType.Transfer:
                  case PaymentType.Credit_Card:
                  case PaymentType.Debit_Card:
                    return "Confirmar Pago";
                  case PaymentType.Current_Account:
                    return "Confirmar cuenta corriente";
                  case PaymentType.Check:
                    return "Confirmar cheque";
                  case PaymentType.Promissory_Note:
                    return "Confirmar nota";
                  default:
                    return "Acción";
                }
              })()}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Modal de rendición efectivo */}
      <RenderOrderModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          onRenderOrder(order.id);
          Alert.alert("Rendición realizada", `Pedido #${order.id} rendido correctamente`);
          setShowModal(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    elevation: 4,
  },
  title: { fontSize: 18, fontWeight: "bold" },
  customer: { fontSize: 18, marginTop: 4 },
  address: { fontSize: 16, marginTop: 4 },
  status: { fontSize: 16, marginTop: 4 },
  priority: { fontSize: 13, fontStyle: "italic", color: "gray", marginTop: 4 },
  paymentType: { fontSize: 16, color: "#444", marginTop: 4 },
  buttonsRow: { flexDirection: "row", marginTop: 12, gap: 8 },
  buttonBlue: { backgroundColor: "#3B82F6", padding: 8, borderRadius: 8 },
  buttonOrange: { backgroundColor: "#F59E0B", padding: 8, borderRadius: 8 },
  buttonGreen: { backgroundColor: "#4CAF50", padding: 8, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
