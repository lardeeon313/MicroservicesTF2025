import React,{useEffect} from "react";
import { View, Text, Alert } from "react-native";
import SendToBillingComponent from "../../components/send/SendToOrderBilled";
import { useSendOrderToBilled } from "../../hocks/useSendOrderToBilled";

interface Props {
  orderID: number;
}

const SendToOrderBilledPage : React.FC<Props> = ({orderID}) => {
  const {SendOrder,loading,error,success} = useSendOrderToBilled();

  const handleSend = async () => {
    await SendOrder(orderID);
  }

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }

    if (success) {
      Alert.alert("Éxito", "El pedido fue enviado a facturación correctamente.");
    }
  }, [error, success]);

  return (
    <View style={{flex: 1,justifyContent: "center",alignItems: "center",padding: 20,backgroundColor: "#f5f5f5"}}>
      <Text style={{fontSize: 18,marginBottom: 20,fontWeight: "bold",}}>Enviar Pedido a Facturación</Text>
      <SendToBillingComponent onPress={handleSend} loading={loading} />
    </View>
  );
}

export default SendToOrderBilledPage;