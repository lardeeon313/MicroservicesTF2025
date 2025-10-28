import { ResolveDeliveryIncidentRequest } from "../types/Request";
import { DeliveryResolvedIncidentStatus } from "../types/DeliveryOrderTypeDto";

export const validateResolveDeliveryIncident = (
  request: ResolveDeliveryIncidentRequest
): string | null => {
  if (!request.incidentId || request.incidentId <= 0) {
    return "El ID del incidente es obligatorio.";
  }
  if (!request.logisticOrderId || request.logisticOrderId <= 0) {
    return "El ID del pedido es obligatorio.";
  }
  if (
    request.resolutionStatus === null ||
    request.resolutionStatus === undefined ||
    !Object.values(DeliveryResolvedIncidentStatus).includes(request.resolutionStatus)
  ) {
    return "Debe seleccionar un estado de resolución válido.";
  }
  if (!request.resolutionNotes || request.resolutionNotes.trim() === "") {
    return "Las notas de resolución son obligatorias.";
  }
  return null;
};
