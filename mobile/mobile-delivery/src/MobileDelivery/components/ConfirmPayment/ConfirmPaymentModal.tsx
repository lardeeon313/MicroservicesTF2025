import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

interface ConfirmPaymentModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderId: string;
}

const ConfirmPaymentModal: React.FC<ConfirmPaymentModalProps> = ({
  visible,
  onClose,
  onConfirm,
  orderId,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 20,
            width: "90%",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            Confirmar pago
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 20 }}>
            ¿Deseas confirmar el pago del pedido #{orderId}?
          </Text>

          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#ccc",
                padding: 10,
                borderRadius: 8,
                marginRight: 10,
              }}
              onPress={onClose}
            >
              <Text style={{ color: "#333" }}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "#4CAF50",
                padding: 10,
                borderRadius: 8,
              }}
              onPress={() => {
                onConfirm();
                onClose();
              }}
            >
              <Text style={{ color: "#fff" }}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmPaymentModal;
