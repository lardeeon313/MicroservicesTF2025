export interface CustomerIncidentReport {
  customerId: string;
  customerName: string;
  totalOrders: number;
  totalIncidents: number;
  totalRejections: number;
  incidentRatePercent: number;
  rejectionRatePercent: number;
}

export interface DeliveryIncidentReport {
  id: number;
  logisticOrderId: number;
  reportedByOperatorId: string;
  assignedOperatorId: string;
  incidentType: string;
  description: string;
  reportedAt: string;
  resolved: boolean;
  resolvedAt: string | null;
  resolutionNote: string | null;
  deliveryIncidentStatus: string;
  deliveryZoneId: number;
  deliveryZoneName: string;
  deliveryTeamId: number;
  deliveryTeamName: string;
  customerName: string;
}

export interface DeliveryRejectionReport {
  id: number;
  logisticOrderId: number;
  operatorId: string;
  rejectionType: string;
  reason: string;
  rejectedAt: string;
  deliveryZoneId: number;
  deliveryZoneName: string;
  deliveryTeamId: number;
  deliveryTeamName: string;
  customerName: string;
}

export interface OrdersByStatusDtoReport {
  status: string;
  count: number;
}

export const STATUS_TRANSLATIONS: Record<string, string> = {
  AssignedDelivery: "Asignado a repartidor",
  AssignmentCancelled: "Asignación cancelada",
  CashVerified: "Pago en efectivo verificado",
  Delivered: "Entregado",
  IncidentResolved: "Incidente resuelto",
  OnTheWay: "En camino",
  PendingDelivery: "Pendiente de entrega",
};

//OrderStatusHistory:

export interface OrderStatusHistoryReport {
  id: number;
  orderId: number;
  customerName: string;
  oldStatus: string;
  newStatus: string;
  changedAt: string;
  averageDurationSeconds: number;
  assignedOperatorId: string;
  assignedTeamName: string;
}

export const OrderStatusLabelsReport: Record<number, string> = {
  0: "Pendiente",
  1: "Emitido",
  2: "Confirmado",
  3: "En preparación",
  4: "Preparado",
  5: "Enviado a facturar",
  6: "Facturado",
  7: "Verificado",
  8: "En camino",
  9: "Entregado",
  10: "Cancelado",
  11: "Pendiente de resolución",
  12: "Reemitido",
  13: "Pendiente de remisión",
  14: "Pendiente de verificación",
  15: "Pendiente de reparto",
  16: "Asignación cancelada",
  17: "Asignado a repartidor",
  18: "Pago en efectivo pendiente",
  19: "Efectivo verificado",
  20: "Pedido con incidente pendiente",
  21: "Incidente resuelto"
};


export const OrderStatusLabelsReportEs: Record<string, string> = {
  pending: "Pendiente",
  issued: "Emitido",
  confirmed: "Confirmado",
  inPreparation: "En preparación",
  prepared: "Preparado",
  sentToBilling: "Enviado a facturación",
  invoiced: "Facturado",
  verified: "Verificado",
  onTheWay: "En camino",
  delivered: "Entregado",
  canceled: "Cancelado",
  pendingResolution: "Pendiente de resolución",
  reIssued: "Reemitido",
  pendingReissued: "Pendiente de reemisión",
  pendingVerification: "Pendiente de verificación",
  pendingDelivery: "Pendiente de entrega",
  assignmentCancelled: "Asignación cancelada",
  assignedDelivery: "Asignado para entrega",
  pendingCashVerification: "Pendiente de verificación de efectivo",
  cashVerified: "Efectivo verificado",
  pendingIncidentResolution: "Pendiente resolución de incidente",
  incidentResolved: "Incidente resuelto"
};


export interface TeamActivityReport {
  deliveryTeamId: number;
  teamName: string;
  totalOrders: number;
  deliveredOrders: number;
  incidentsCount: number;
  rejectionsCount: number;
  averageDeliveryTimeHours: number;
  incidentRatePercent: number;
  rejectionRatePercent: number;
  deliverySuccessRatePercent: number;
}

export interface PendingCashVerificationReport {
  orderId: number;
  customerName: string;
  totalAmount: number;
  orderDate: string;
  assignedOperatorId: string;
  assignedTeamName: string;
}

//Reporte : productividad por repartidor

export interface OperatorProductivityReport {
  operatorId: string;
  totalOrders: number;
  deliveredOrders: number;
  rejectedOrders: number;
  pendingOrders: number;
  canceledOrders: number;
  totalCollectedAmount: number;
}

//Report: Tiempos de entrega - DELVERY TIME: 

export interface DeliveryTimeReportItem {
  deliveryZoneId: number;
  deliveryZoneName: string;
  operatorId: string;
  totalDeliveredOrders: number;
  averageDeliveryTimeInHours: number;
  maxDeliveryTimeInHours: number;
  minDeliveryTimeInHours: number;
}

//Report: Eficiencia por zona - ZONA PERFOMANCE: 

export interface ZonePerformanceReport {
  deliveryZoneId: number;
  deliveryZoneName: string;
  totalOrders: number;
  deliveredOrders: number;
  incidentsCount: number;
  rejectionsCount: number;
  averageDeliveryTimeHours: number;
  incidentRatePercent: number;
  rejectionRatePercent: number;
  deliverySuccessRatePercent: number;
  topTeamName: string;
  topTeamId: number;
}

//OrderStatus History: 

export const EnglishToSpanishStatusMap: Record<string, string> = {
  "Pending": "Pendiente",
  "Issued": "Emitido",
  "Confirmed": "Confirmado",
  "InPreparation": "En preparación",
  "Prepared": "Preparado",
  "SentToBilling": "Enviado a facturar",
  "Invoiced": "Facturado",
  "Verified": "Verificado",
  "OnTheWay": "En camino",
  "Delivered": "Entregado",
  "Canceled": "Cancelado",
  "PendingResolution": "Pendiente de resolución",
  "ReIssued": "Reemitido",
  "PendingReissued": "Pendiente de remisión",
  "PendingVerification": "Pendiente de verificación",
  "PendingDelivery": "Pendiente de reparto",
  "AssignmentCancelled": "Asignación cancelada",
  "AssignedDelivery": "Asignado a repartidor",
  "PendingCashVerification": "Pago en efectivo pendiente",
  "CashVerified": "Efectivo verificado",
  "PendingIncidentResolution": "Pedido con incidente pendiente",
  "IncidentResolved": "Incidente resuelto"
};


//PAGINADO: 
export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
