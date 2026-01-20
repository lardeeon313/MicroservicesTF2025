import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

type Props = {
  visible: boolean;
  type: "accept" | "reject";
  onClose: () => void;
};

const AcceptOrderSuccessModal: React.FC<Props> = ({
  visible,
  type,
  onClose,
}) => {
  const isAccept = type === "accept";

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.container}>

          <Text
            style={[
              styles.title,
              { color: isAccept ? "#16A34A" : "#DC2626" },
            ]}
          >
            {isAccept ? "¡Pedido confirmado!" : "Pedido rechazado"}
          </Text>

          <Text style={styles.message}>
            {isAccept ? (
              <>
                El pedido ahora se encuentra en el listado de{"\n"}
                <Text style={styles.bold}>
                  pedidos en preparación o con faltantes
                </Text>
              </>
            ) : (
              "El pedido fue rechazado correctamente y será reasignado."
            )}
          </Text>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isAccept ? "#16A34A" : "#DC2626" },
            ]}
            onPress={onClose}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>
              Ir a la pantalla principal
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

export default AcceptOrderSuccessModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    width: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,

    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },

  message: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },

  bold: {
    fontWeight: "600",
    color: "#333",
  },

  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#F9FAFB",
  },
});
