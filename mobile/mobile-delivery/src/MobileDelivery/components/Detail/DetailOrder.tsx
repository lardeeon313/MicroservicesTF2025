// DetailOrderComponent.tsx
import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from "react-native";
import { LogisticOrder } from "../../types/DeliveryOrderTypeDto";

type Props = {
  order: LogisticOrder | null;
  loading: boolean;
  error: string | null;
};

export default function DetailOrderComponent({ order, loading, error }: Props) {
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#27ae60" />
        <Text>Cargando orden...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: "red", fontSize: 16 }}>{error}</Text>
      </View>
    );
  }
  if (!order) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text>No se encontró la orden.</Text>
      </View>
    );
  }

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
          {order.deliveryAddress.street} {order.deliveryAddress.number}
          {order.deliveryAddress.apartment ? `, ${order.deliveryAddress.apartment}` : ""},{" "}
          {order.deliveryAddress.city}
        </Text>
        <Text style={styles.label}>Fecha de entrga: </Text>
        <Text style={styles.text}>{order.deliveryDate}</Text>
        <Text style={styles.label}>Estado:</Text>
        <Text style={styles.text}>{order.deliveryStatus}</Text>
        <Text style={styles.label}>Tipo de Pago:</Text>
        <Text style={styles.text}>{order.deliveryPayment}</Text>
        <Text style={styles.label}>Detalle del pedido: </Text>
        <Text style={styles.text}>{order.deliveryDetail}</Text>
        <Text style={styles.label}>Recibo de pago:</Text>
        <Text style={styles.text}>{order.paymentReceipt}</Text>
        <Text style={styles.label}>Prioridad:</Text>
        <Text style={styles.text}>{order.deliveryPriority}</Text>
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
              <Text style={styles.productName}>{item.productName}</Text>
              <Text style={styles.productInfo}>* Cantidad: {item.quantity}</Text>
              <Text style={styles.productInfo}>
                * Precio unitario: ${item.unitPrice?.toFixed(2) ?? "0.00"}
              </Text>
              <Text style={styles.productTotal}>
                * Subtotal: ${(item.total ?? item.quantity * (item.unitPrice ?? 0)).toFixed(2)}
              </Text>
            </View>
          ))
        ) : (
          <Text style={{ fontSize: 16, color: "#555" }}>No hay productos asociados.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f5f5f5", 
    padding: 20 
  },
  header: { 
    alignItems: "center", 
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logo: { 
    width: 80, 
    height: 80, 
    resizeMode: "contain", 
    marginBottom: 12 
  },
  title: { 
    fontSize: 24, 
    fontWeight: "700", 
    color: "#2c3e50",
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginBottom: 20,
  },
  label: { 
    fontWeight: "700", 
    fontSize: 15, 
    color: "#2c3e50",
    marginTop: 12,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  text: { 
    fontSize: 16, 
    color: "#555", 
    marginBottom: 4,
    lineHeight: 22,
  },
  total: { 
    color: "#27ae60", 
    fontWeight: "700",
    fontSize: 20,
    marginTop: 8,
  },
  productsContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginBottom: 24,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: "700", 
    marginBottom: 16, 
    color: "#2c3e50",
    borderBottomWidth: 2,
    borderBottomColor: "#27ae60",
    paddingBottom: 8,
  },
  productCard: { 
    borderBottomWidth: 1, 
    borderBottomColor: "#e8e8e8", 
    paddingVertical: 16,
    marginBottom: 8,
  },
  productName: { 
    fontSize: 17, 
    fontWeight: "700", 
    color: "#2c3e50",
    marginBottom: 8,
  },
  productInfo: { 
    fontSize: 15, 
    color: "#666",
    marginBottom: 4,
    paddingLeft: 8,
  },
  productTotal: { 
    fontSize: 16, 
    color: "#27ae60", 
    fontWeight: "700",
    marginTop: 4,
    paddingLeft: 8,
  },
});