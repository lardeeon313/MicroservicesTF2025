import { ReportDeliveryIncidentRequest } from "../types/Request";

export const validateReportDeliveryIncident = (
  request: ReportDeliveryIncidentRequest
): string | null => {
  if (!request.logisticOrderId) {
    return "El ID del pedido es obligatorio.";
  }
  if (!request.operatorUserId || request.operatorUserId.trim() === "") {
    return "El ID del operador es obligatorio.";
  }
  if (!request.incidentType || request.incidentType.trim() === "") {
    return "El tipo de incidente es obligatorio.";
  }
  if (!request.description || request.description.trim() === "") {
    return "La descripción del incidente es obligatoria.";
  }
  return null; 
};