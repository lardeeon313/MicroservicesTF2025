import React from "react";
import { Modal,View,Text,TouchableOpacity,StyleSheet,} from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  onAccept: () => void; // 👈 navegación
}

const AllProductsMarkedModal: React.FC<Props> = ({
  visible,
  onClose,
  onAccept,
}) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.container}>

          <Text style={styles.title}>¡Enhorabuena!</Text>

          <Text style={styles.message}>
            Se han marcado todos los productos de este pedido.
            Ahora se encuentra en la lista de pedidos armados.
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={onAccept} // 👈 ACÁ
          >
            <Text style={styles.buttonText}>Aceptar</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

export default AllProductsMarkedModal;


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 22,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    color: "#444",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#16A34A",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
