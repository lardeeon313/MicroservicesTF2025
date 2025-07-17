import React,{useState} from "react";
import { Alert, Modal, Text, TextInput, View, Button, StyleSheet  } from "react-native";

type ActionCallback = () => void; 
//Le pide una razon de por que rechazo el pedido que despues sera almacenada 
type ActionWithReasonCallBack = (reason: string) => void; 

export const AlertManager = (title:string,message:string,onConfirm:ActionCallback) => {
    Alert.alert(
    title,
    message,
    [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Confirmar',
        onPress: onConfirm,
      },
    ],
    { cancelable: false }
  );
}; 

export const showmeAcceptOrderAlert = (onConfirm:ActionCallback) => {
  AlertManager('Aceptar Pedido', '¿Estás seguro de aceptar este pedido?',() => {
    onConfirm();
    Alert.alert(
      '¡Pedido confirmado!',
      "El pedido ha sido confirmado. Ahora se encuentra en el listado de 'Pedidos para preparar' o tambien en 'pedidos con faltantes'"
    )
  })
}

export const showmeRejectOrderAlert = (onConfirm:ActionCallback) => {
  AlertManager('Rechazar Pedido', '¿Estás seguro de rechazar este pedido?', onConfirm)
}

// ✅ RECHAZAR PEDIDO CON RAZÓN
export const RejectOrderWithReasonModal = ({
  visible,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  onCancel: () => void;
  onConfirm: ActionWithReasonCallBack;
}) => {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if(!reason.trim()){
      Alert.alert("Motivo requerido", "Por favor ingresá una razón válida.");
      return;
    }
    onConfirm(reason.trim());
    setReason("");
  };

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={{flex: 1,justifyContent: "center",backgroundColor: "rgba(0,0,0,0.5)",padding: 20,}}>
        <View style={{backgroundColor: "white",padding: 20,borderRadius: 10,gap: 10,}}>
          <Text style={{fontSize: 18,fontWeight: "bold",}}>Rechazar Pedido</Text>
          <Text style={{fontSize: 14}}>Ingrese la razón del rechazo:</Text>
          <TextInput
            style={{borderColor: "#ccc",borderWidth: 1,borderRadius: 6,padding: 10,minHeight: 80,textAlignVertical: "top",}}
            placeholder="Motivo..."
            value={reason}
            onChangeText={setReason}
            multiline
          />
          <View style={{flexDirection: "row",justifyContent: "space-between",}}>
            <Button title="Cancelar" onPress={onCancel} color="gray" />
            <Button title="Confirmar" onPress={handleConfirm} />
          </View>
        </View>
      </View>
    </Modal>
  );
};