import { RejectAssingOrderRequest } from "../types/Request";

export type RejectAssignedOrderValidationResult = {
  isValid: boolean;
  errors: Partial<Record<keyof RejectAssingOrderRequest, string>>;
};

/**
 * Valida el request para rechazar un pedido asignado.
 * Actualmente solo valida el campo `reason`, pero puede ampliarse fácilmente.
 */
export function validateRejectAssignedOrder(
  request: RejectAssingOrderRequest
): RejectAssignedOrderValidationResult {
  const errors: Partial<Record<keyof RejectAssingOrderRequest, string>> = {};

  // 🔹 Validar motivo del rechazo
  if (!request.reason || request.reason.trim() === "") {
    errors.reason = "El motivo del rechazo es obligatorio";
  } else if (request.reason.trim().length < 5) {
    errors.reason = "El motivo del rechazo debe tener al menos 5 caracteres";
  }

  // 🔹 (Opcional) Podés agregar validaciones adicionales si querés:
  // if (!request.operatorUserId) errors.operatorUserId = "Falta el ID del operador";
  // if (!request.logisticOrderId) errors.logisticOrderId = "Falta el ID del pedido";

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}