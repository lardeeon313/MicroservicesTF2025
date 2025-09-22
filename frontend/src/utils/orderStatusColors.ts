import { OrderStatus } from "../features/sales/types/OrderTypes";

export const orderStatusStyles: Record<OrderStatus, { text: string; bg: string }> = {
  [OrderStatus.Pending]: {
    text: "text-gray-700",
    bg: "bg-gray-200", // gris = en espera
  },
  [OrderStatus.ReIssued]: {
    text: "text-yellow-700",
    bg: "bg-yellow-100", // amarillo = reemitido
  },
  [OrderStatus.PendingResolution]: {
    text: "text-yellow-700",
    bg: "bg-yellow-100", // amarillo claro = pendiente de resolución
  },
  [OrderStatus.PendingReissued]: {
    text: "text-yellow-700",
    bg: "bg-yellow-100", // amarillo claro = pendiente de reemisión
  },
  [OrderStatus.SentToBilling]: {
    text: "text-purple-700",
    bg: "bg-purple-100", // morado = enviado a facturación
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
  [OrderStatus.Invoiced]: {
    text: "text-emerald-700",
    bg: "bg-emerald-100", // verde fuerte = facturado
  },
  [OrderStatus.Verify]: {
    text: "text-cyan-700",
    bg: "bg-cyan-100", // celeste brillante = requiere verificación
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
  [OrderStatus.Modified]: {
    text: "text-pink-700",
    bg: "bg-pink-100", // rosado = modificado/alterado
  },
}