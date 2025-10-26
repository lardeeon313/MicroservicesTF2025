import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { LogisticOrder } from "../../types/DeliveryOrderTypeDto";

type Props = {
  order: LogisticOrder;
};

export default function DetailOrderComponent({ order }: Props) {
  return (
    <ScrollView style={styles.container}>
      {/* Header con logo */}
      <View style={styles.header}>
        <Image
          source={require("../../../assetsImages/LogoVerona.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Detalle del Pedido #{order.id}</Text>
      </View>

      {/* Datos del pedido */}
      <View style={styles.card}>
        <Text style={styles.label}>Cliente:</Text>
        <Text style={styles.text}>
          {order.customer.firstName} {order.customer.lastName}
        </Text>

        <Text style={styles.label}>Dirección:</Text>
        <Text style={styles.text}>
          {order.deliveryAddress.street} {order.deliveryAddress.number},
          {order.deliveryAddress.apartment
            ? ` ${order.deliveryAddress.apartment},`
            : ""}{" "}
          {order.deliveryAddress.city}
        </Text>
        <Text style={styles.label}>Fecha de entrga: </Text>
        <Text style={styles.text}>
          {order.deliveryDate
            ? new Date(order.deliveryDate).toLocaleString("es-AR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }) + " hs"
            : "Sin fecha"}
        </Text>
        <Text style={styles.label}>Estado:</Text>
        <Text style={styles.text}>{order.status}</Text>

        <Text style={styles.label}>Tipo de Pago:</Text>
        <Text style={styles.text}>{order.paymentType}</Text>

        <Text style={styles.label}>Prioridad:</Text>
        <Text style={styles.text}>{order.priority}</Text>

        {order.totalAmount && (
          <>
            <Text style={styles.label}>Total:</Text>
            <Text style={[styles.text, styles.total]}>
              ${order.totalAmount.toFixed(2)}
            </Text>
          </>
        )}
      </View>

      {/* Productos */}
      <View style={styles.productsContainer}>
        <Text style={styles.sectionTitle}>Productos</Text>

        {order.items && order.items.length > 0 ? (
          order.items.map((item) => (
            <View style={styles.productCard} key={item.id}>
              <Text style={styles.productName}> {item.productName}</Text>
              <Text style={styles.productInfo}>* Cantidad: {item.quantity}</Text>
              <Text style={styles.productInfo}>* Precio unitario: ${item.unitPrice?.toFixed(2) ?? "0.00"}</Text>
              <Text style={styles.productTotal}>
                * Subtotal: $
                {(
                  item.total ??
                  item.quantity * (item.unitPrice ?? 0)
                ).toFixed(2)}
              </Text>
            </View>
          ))
        ) : (
          <Text style={{ fontSize: 16, color: "#555" }}>
            No hay productos asociados.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 16 },
  header: { alignItems: "center", marginBottom: 12 },
  logo: { width: 60, height: 60, resizeMode: "contain", marginBottom: 6 },
  title: { fontSize: 22, fontWeight: "bold", color: "#333" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    elevation: 3,
    marginBottom: 16,
  },
  label: { fontWeight: "bold", fontSize: 16, color: "#333" },
  text: { fontSize: 16, color: "#555", marginBottom: 6 },
  total: { color: "#27ae60", fontWeight: "bold" },

  productsContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    elevation: 2,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  productCard: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 8,
  },
  productName: { fontSize: 16, fontWeight: "bold", color: "#222" },
  productInfo: { fontSize: 15, color: "#555" },
  productTotal: { fontSize: 15, color: "#27ae60", fontWeight: "bold" },
});


