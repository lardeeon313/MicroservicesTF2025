import { OrderStatus } from "../features/sales/types/OrderTypes";

export const orderStatusStyles: Record<OrderStatus, { text: string; bg: string }> = {
  [OrderStatus.Pending]: {
    text: "text-gray-700",
    bg: "bg-gray-200", // gris = en espera
  },
  [OrderStatus.Issued]: {
    text: "text-blue-700",
    bg: "bg-blue-100", // azul = emitido/documentado
  },
  [OrderStatus.Confirmed]: {
    text: "text-indigo-700",
    bg: "bg-indigo-100", // índigo = confirmado/verificado
  },
  [OrderStatus.InPreparation]: {
    text: "text-teal-700",
    bg: "bg-teal-100", // teal = en preparación (activo)
  },
  [OrderStatus.Prepared]: {
    text: "text-sky-700",
    bg: "bg-sky-100", // celeste = listo para enviar
  },
  [OrderStatus.SentToBilling]: {
    text: "text-purple-700",
    bg: "bg-purple-100", // morado = enviado a facturación
  },
  [OrderStatus.Invoiced]: {
    text: "text-emerald-700",
    bg: "bg-emerald-100", // verde fuerte = facturado
  },
  [OrderStatus.Verified]: {
    text: "text-cyan-700",
    bg: "bg-cyan-100", // celeste brillante = verificado
  },
  [OrderStatus.OnTheWay]: {
    text: "text-yellow-800",
    bg: "bg-yellow-100", // amarillo = en tránsito
  },
  [OrderStatus.Delivered]: {
    text: "text-green-700",
    bg: "bg-green-100", // verde = entregado con éxito
  },
  [OrderStatus.Canceled]: {
    text: "text-red-700",
    bg: "bg-red-100", // rojo = cancelado
  },
  [OrderStatus.PendingResolution]: {
    text: "text-yellow-700",
    bg: "bg-yellow-100", // amarillo claro = pendiente de resolución
  },
  [OrderStatus.PendingReissued]: {
    text: "text-orange-700",
    bg: "bg-orange-100", // naranja claro = pendiente de reemision
  },
  [OrderStatus.Modified]: {
    text: "text-gray-800",
    bg: "bg-gray-300", // gris oscuro = modificado
  },
  [OrderStatus.Verify]: {
    text: "text-yellow-700",
    bg: "bg-yellow-200", // amarillo = por verificar
  },
  [OrderStatus.PendingVerification]: {
    text: "text-lime-700",
    bg: "bg-lime-100", // lima = pendiente de verificación
  },
  [OrderStatus.PendingDelivery]: {
    text: "text-violet-700",
    bg: "bg-violet-100", // violeta = pendiente de reparto
  },
  [OrderStatus.AssignmentCancelled]: {
    text: "text-rose-700",
    bg: "bg-rose-100", // rosa = asignación cancelada
  },
  [OrderStatus.AssignedDelivery]: {
    text: "text-fuchsia-700",
    bg: "bg-fuchsia-100", // fucsia = asignado a reparto
  },
  [OrderStatus.PendingCashVerification]: {
    text: "text-stone-700",
    bg: "bg-stone-100", // piedra = efectivo pendiente de verificación
  },
  [OrderStatus.CashVerified]: {
    text: "text-green-700",
    bg: "bg-green-50", // verde claro = efectivo verificado
  },
  [OrderStatus.PendingIncidentResolution]: {
    text: "text-red-800",
    bg: "bg-red-50", // rojo claro = pendiente de resolución de incidente
  },
  [OrderStatus.IncidentResolved]: {
    text: "text-green-600",
    bg: "bg-green-200", // verde = incidente resuelto
  },
};
