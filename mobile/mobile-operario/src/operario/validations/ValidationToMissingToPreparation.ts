//Validador que valida que el pedido pase de MissingPRoduct a In Preparacion cuando no tenga ningun
//faltante. 

import type { DepotOrderDTO } from "../types/OrderDTO";
import { DepotOrderStatus } from "../types/OrderDTO";

/**
 * Verifica si un pedido puede pasar a estado 'InPreparation'
 * @param order Pedido del depósito
 * @returns true si no tiene faltantes, false si tiene
 */

export const ValidationToMissingToPreparation = (order:DepotOrderDTO) : {canChange: boolean;reason?: string;} => {
  if (order.status === DepotOrderStatus.InPreparation) {
    return {
      canChange: false,
      reason: "El pedido ya está en preparación.",
    };
  }

  if (order.status === DepotOrderStatus.MissingProduct && order.missings.length > 0) {
    return {
      canChange: false,
      reason: "No se puede pasar a preparación mientras haya faltantes.",
    };
  }

  return {
    canChange: true,
  };
}