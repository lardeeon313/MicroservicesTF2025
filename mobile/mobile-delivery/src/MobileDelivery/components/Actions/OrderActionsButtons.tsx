import React from "react";
import { View, TouchableOpacity, Text, Alert, StyleSheet } from "react-native";
import { PaymentType } from "../../types/DeliveryOrderTypeDto";

type Props = {
  paymentType: PaymentType;
};

const OrderActionButtons: React.FC<Props> = ({ paymentType }) => {
  const handleAction = (message: string) => {
    Alert.alert("Acción realizada", message, [{ text: "OK" }]);
  };

  const renderButton = () => {
    switch (paymentType) {
      case PaymentType.Cash:
        return (
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleAction("Cuenta rendida correctamente.")}
          >
            <Text style={styles.text}>Rendir cuenta</Text>
          </TouchableOpacity>
        );

      case PaymentType.Transfer:
      case PaymentType.Credit_Card:
      case PaymentType.Debit_Card:
        return (
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleAction("Pago confirmado exitosamente.")}
          >
            <Text style={styles.text}>Confirmar pago</Text>
          </TouchableOpacity>
        );

      case PaymentType.Current_Account:
        return (
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleAction("Cuenta corriente confirmada.")}
          >
            <Text style={styles.text}>Confirmar cuenta corriente</Text>
          </TouchableOpacity>
        );

      case PaymentType.Check:
        return (
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleAction("Cheque confirmado correctamente.")}
          >
            <Text style={styles.text}>Confirmar cheque</Text>
          </TouchableOpacity>
        );

      case PaymentType.Promissory_Note:
        return (
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleAction("Nota confirmada correctamente.")}
          >
            <Text style={styles.text}>Confirmar nota</Text>
          </TouchableOpacity>
        );

      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderButton()}</View>;
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  text: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default OrderActionButtons;
