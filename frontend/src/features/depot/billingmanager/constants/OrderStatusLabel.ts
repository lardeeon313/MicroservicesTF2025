export const OrderStatusLabel: { [key: number]: string } = {
  0: "Pendiente de facturación",
  1: "En proceso de facturación",
  2: "Facturado",
  3: "Facturación rechazada",
  4: "Pendiente de revisión",
  5: "Anulado"
};

// Colores para los estados
export const OrderStatusColors: { [key: number]: string } = {
  0: "bg-yellow-100 text-yellow-800", // Pendiente de facturación
  1: "bg-blue-100 text-blue-800",     // En proceso
  2: "bg-green-100 text-green-800",   // Facturado
  3: "bg-red-100 text-red-800",       // Rechazado
  4: "bg-purple-100 text-purple-800", // Pendiente de revisión
  5: "bg-gray-100 text-gray-800"      // Anulado
};

// Enum para usar en el código
export enum BillingOrderStatus {
  PENDING = 0,
  IN_PROCESS = 1,
  INVOICED = 2,
  REJECTED = 3,
  PENDING_REVIEW = 4,
  CANCELLED = 5
} 