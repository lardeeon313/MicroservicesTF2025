//valida que el texto que ingrese el opeario para notificar el depotmanager no este vacio o sea
//solo numeros etc. 
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

  // ⚠️ Acá sí o sí actualizás el objeto
  const updatedMissing: ReportOrderMissingRequest = {
    ...missing,
    missingDescription: trimmed, 
    missingReason: missing.missingReason?.trim() || "Faltante detectado", // ← agregado
  };

  console.log("✅ Enviando descripción:", trimmed);
  console.log("✅ Enviando objeto missing:", updatedMissing);

  try {
    const response = await reportOrderMissing(updatedMissing);
    onSuccess(response);
  } catch (error) {
    console.log("❌ Error real del backend:", error);
    Alert.alert("Error", "No se pudo enviar la notificación.");
  }
}
