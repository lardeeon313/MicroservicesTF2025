import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface OrdersNotFoundProps {
  onRefresh?: () => void;        // función opcional
  icon?: string;                 // emoji o ícono
  title?: string;                // título del mensaje
  message?: string;              // subtítulo
  buttonText?: string;           // texto del botón
  backgroundColor?: string;      // color de fondo
}

const OrdersNotFound: React.FC<OrdersNotFoundProps> = ({
  onRefresh,
  icon = "⚠️",
  title = "No hay órdenes en preparación",
  message = "Puedes asignar órdenes desde el módulo de órdenes pendientes.",
  buttonText = "Actualizar",
  backgroundColor = "#fff",
}) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Icono */}
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      {/* Título */}
      <Text style={styles.title}>{title}</Text>

      {/* Mensaje */}
      <Text style={styles.subtitle}>{message}</Text>

      {/* Botón */}
      {onRefresh && (
        <TouchableOpacity style={styles.button} onPress={onRefresh}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  iconContainer: {
    backgroundColor: "#f3f6ff",
    borderRadius: 50,
    padding: 15,
    marginBottom: 15,
  },
  icon: {
    fontSize: 30,
    color: "#e60000",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0b132b",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#e60000",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default OrdersNotFound;
