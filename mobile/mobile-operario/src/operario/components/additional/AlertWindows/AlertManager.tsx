import { Alert } from "react-native";

type ActionCallback = () => void; 

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
  AlertManager('Aceptar Pedido', '¿Estás seguro de aceptar este pedido?', onConfirm)
}

export const showmeRejectOrderAlert = (onConfirm:ActionCallback) => {
  AlertManager('Rechazar Pedido', '¿Estás seguro de rechazar este pedido?', onConfirm)
}
