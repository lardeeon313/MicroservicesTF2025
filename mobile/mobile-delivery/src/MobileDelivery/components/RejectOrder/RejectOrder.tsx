import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput } from "react-native";

type RejectOrderModalProps = {
  visible: boolean;
  orderId: number | null;
  onReject: (reason: string) => void;
  onCancel: () => void;
};

export default function RejectOrderModal({
  visible,
  orderId,
  onReject,
  onCancel,
}: RejectOrderModalProps) {
  const [rejectReason, setRejectReason] = useState("");

  const handleReject = () => {
    if (rejectReason.trim()) {
      onReject(rejectReason);
      setRejectReason("");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Rechazar Pedido</Text>
          <Text>¿Por qué deseas rechazar el pedido #{orderId}?</Text>
          <TextInput
            style={styles.input}
            placeholder="Escriba aqui de manera breve..."
            value={rejectReason}
            onChangeText={setRejectReason}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#e41616ff" }]}
              onPress={handleReject}
            >
              <Text style={styles.modalButtonText}>Rechazar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#ccc" }]}
              onPress={onCancel}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: "40%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
});
