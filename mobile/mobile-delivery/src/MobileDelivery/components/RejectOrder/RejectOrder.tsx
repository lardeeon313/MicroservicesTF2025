import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { LogisticOrder } from "../../types/DeliveryOrderTypeDto";
import { RejectAssingOrderRequest } from "../../types/Request";
import { validateRejectAssignedOrder } from "../../validations/ValidateRejectAssignedOrder";

type RejectAssignedOrderComponentProps = {
  order: LogisticOrder | null;
  loading: boolean;
  onReject: (reason: string) => void;
};

export default function RejectAssignedOrderComponent({
  order,
  loading,
  onReject,
}: RejectAssignedOrderComponentProps) {
  const [reason, setReason] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRejectPress = () => {
    if (!order) return;

    // 🔹 Construimos el request según la interfaz real
    const request: RejectAssingOrderRequest = {
      logisticOrderId: order.id,
      operatorUserId: "", // se completa en la Page
      reason,
    };

    // 🔹 Validamos usando la función desacoplada
    const validation = validateRejectAssignedOrder(request);

    if (!validation.isValid) {
      setErrorMessage(validation.errors.reason ?? "Motivo inválido");
      return;
    }

    setErrorMessage(null);
    onReject(reason);
  };

  if (!order) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>No se encontró información del pedido.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Header con logo */}
        <View style={styles.header}>
          <Image
            source={require("../../../assetsImages/LogoVerona.png")}
            style={styles.logo}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerLabel}>Pedido</Text>
            <Text style={styles.orderId}>#{order.id}</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Título principal */}
        <View style={styles.titleContainer}>
          <Text style={styles.warningIcon}>🚫</Text>
          <Text style={styles.title}>Rechazar Pedido</Text>
        </View>

        {/* Input section */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>
            Motivo del rechazo <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.input,
              errorMessage && styles.inputError,
              loading && styles.inputDisabled,
            ]}
            placeholder="Describe brevemente el motivo del rechazo..."
            placeholderTextColor="#999"
            value={reason}
            onChangeText={(text) => {
              setReason(text);
              setErrorMessage(null);
            }}
            editable={!loading}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {errorMessage && (
            <View style={styles.errorMessageContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            </View>
          )}
        </View>

        {/* Botón de acción */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRejectPress}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <View style={styles.buttonContent}>
              <Text style={styles.buttonSpinner}>⏳</Text>
              <Text style={styles.buttonText}>Enviando...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Confirmar Rechazo</Text>
          )}
        </TouchableOpacity>

        {/* Nota informativa */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>Esta acción notificará al sistema.</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 64,
    height: 64,
    resizeMode: "contain",
  },
  headerTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  headerLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    marginBottom: 2,
  },
  orderId: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  warningIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#e41616",
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  required: {
    color: "#e41616",
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    backgroundColor: "#fafafa",
    color: "#333",
    minHeight: 100,
  },
  inputError: {
    borderColor: "#e41616",
    backgroundColor: "#fff5f5",
  },
  inputDisabled: {
    backgroundColor: "#f0f0f0",
    color: "#999",
  },
  errorMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "#fff5f5",
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#e41616",
  },
  errorIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  errorMessage: {
    color: "#e41616",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  button: {
    backgroundColor: "#e41616",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#e41616",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonSpinner: {
    fontSize: 18,
    marginRight: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 20,
    padding: 12,
    backgroundColor: "#f0f7ff",
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#2196F3",
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff5f5",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ffcdd2",
  },
  errorText: {
    color: "#e41616",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});