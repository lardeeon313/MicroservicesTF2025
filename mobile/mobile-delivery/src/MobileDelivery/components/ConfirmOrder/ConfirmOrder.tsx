import React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";

type ConfirmOrderModalProps = {
  visible: boolean;
  orderId: number | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmOrderModal({
  visible,
  orderId,
  onConfirm,
  onCancel,
}: ConfirmOrderModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Confirmar Pedido</Text>
          <Text>¿Estás seguro de que deseas confirmar el pedido #{orderId}?</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#4a9c13ff" }]}
              onPress={onConfirm}
            >
              <Text style={styles.modalButtonText}>Confirmar</Text>
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
});
