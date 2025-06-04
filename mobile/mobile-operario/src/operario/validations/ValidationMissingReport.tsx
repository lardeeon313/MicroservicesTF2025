//valida que el texto que ingrese el opeario para notificar el depotmanager no este vacio o sea
//solo numeros etc. 

import { Alert } from "react-native";
import type { Notification,Missing } from "../types/Missing";

export function ValidationMissingReport(description:string,missing:Missing,onSuccess : (notification:Notification) => void):void{
    const trimmed = description.trim();
    
    if(!trimmed){
        Alert.alert("Error", "La notificacion no puede estar vacía");
        return;
    }

    if (/^\d+$/.test(trimmed)) {
        Alert.alert("Error", "La notificacion no puede contener solo números");
        return;
    }

    const validCharsRegex = /^[a-zA-Z0-9 $áéíóúÁÉÍÓÚñÑ.,()-]+$/;
    if(!validCharsRegex.test(trimmed)){
        Alert.alert("Error", "La descripción contiene caracteres no permitidos");
        return;
    }

    const notification = missing.notifyMissing(trimmed);
    onSuccess(notification);
}