import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from "react-native";
import { LogisticOrder } from "../../types/DeliveryOrderTypeDto";

type ConfirmOrderComponentProps = {
  order: LogisticOrder | null;
  loading: boolean;
  onConfirm: () => void;
};

export default function ConfirmOrderComponent({ order, loading, onConfirm }: ConfirmOrderComponentProps) {
  if (!order) return <Text>No se encontró el pedido.</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Confirmar Pedido #{order.id}</Text>

      {/* Datos del pedido */}
      <View style={styles.card}>
        <Text style={styles.label}>Cliente:</Text>
        <Text style={styles.text}>{order.customer.firstName} {order.customer.lastName}</Text>
        <Text style={styles.label}>Dirección:</Text>
        <Text style={styles.text}>
          {order.deliveryAddress.street} {order.deliveryAddress.number}, {order.deliveryAddress.city}
        </Text>
        <Text style={styles.label}>Estado:</Text>
        <Text style={styles.text}>{order.status}</Text>
        <Text style={styles.label}>Tipo de Pago:</Text>
        <Text style={styles.text}>{order.paymentType}</Text>
        <Text style={styles.label}>Prioridad:</Text>
        <Text style={styles.text}>{order.deliveryPriority}</Text>
        {order.totalAmount && (
          <>
            <Text style={styles.label}>Total:</Text>
            <Text style={[styles.text, styles.total]}>${order.totalAmount.toFixed(2)}</Text>
          </>
        )}
      </View>

      {/* Productos */}
      <View style={styles.productsContainer}>
        <Text style={styles.sectionTitle}>Productos</Text>
        {order.items && order.items.length > 0 ? (
          order.items.map((item) => (
            <View style={styles.productRow} key={item.id}>
              <Text style={styles.productName}>{item.productName}</Text>
              <Text style={styles.productInfo}>{item.quantity} x ${item.unitPrice?.toFixed(2) ?? "0.00"}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noProducts}>No hay productos asociados.</Text>
        )}
      </View>

      {/* Botón de confirmación */}
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={onConfirm}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Confirmando..." : `Confirmar pedido #${order.id}`}</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#4a9c13ff" style={{ marginTop: 20 }} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  card: { backgroundColor: "#fff", borderRadius: 10, padding: 16, marginBottom: 16, elevation: 3 },
  label: { fontWeight: "bold", fontSize: 16, color: "#333" },
  text: { fontSize: 16, color: "#555", marginBottom: 6 },
  total: { color: "#27ae60", fontWeight: "bold" },
  productsContainer: { backgroundColor: "#fff", borderRadius: 10, padding: 16, elevation: 2, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8, color: "#333" },
  productRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  productName: { fontSize: 15, fontWeight: "bold", color: "#222" },
  productInfo: { fontSize: 15, color: "#555" },
  noProducts: { fontSize: 15, color: "#555", textAlign: "center" },
  confirmButton: { backgroundColor: "#4a9c13ff", padding: 15, borderRadius: 10, width: "80%", alignItems: "center", alignSelf: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
