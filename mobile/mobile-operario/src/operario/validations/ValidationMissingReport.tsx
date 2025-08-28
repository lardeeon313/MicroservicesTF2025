 
import { Alert } from "react-native";
import type { DepotOrderMissingDTO, ReportOrderMissingRequest } from "../types/Missing";
import { reportOrderMissing } from "../services/GetMissingOrdersService";

export async function ValidationMissingReport(
  description: string,
  missing: ReportOrderMissingRequest,
  onSuccess: (updateNotification: DepotOrderMissingDTO) => void
): Promise<void> {
  const trimmed = description.trim();

  if (!trimmed) {
    Alert.alert("Error", "La notificación no puede estar vacía");
    return;
  }

  if (/^\d+$/.test(trimmed)) {
    Alert.alert("Error", "La notificación no puede contener solo números");
    return;
  }

  const validCharsRegex = /^[a-zA-Z0-9 $áéíóúÁÉÍÓÚñÑ.,()-]+$/;
  if (!validCharsRegex.test(trimmed)) {
    Alert.alert("Error", "La descripción contiene caracteres no permitidos");
    return;
  }

  
  const updatedMissing: ReportOrderMissingRequest = {
    ...missing,
    missingDescription: trimmed, 
    missingReason: missing.missingReason?.trim() || "Faltante detectado", 
  };



  try {
    const response = await reportOrderMissing(updatedMissing);
    onSuccess(response);
  } catch (error) {
    
    Alert.alert("Error", "No se pudo enviar la notificación.");
  }
}
