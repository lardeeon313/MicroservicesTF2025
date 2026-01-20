//TYPES PARA UTILIZAR EN LOS REPORTES DE LOGISTICA 
import { OrderStatus } from "../OrderTypes";

export interface FilterCustomerWithIncident {
  startDate?: string;
  endDate?: string;
  customerId?: string;
  incidentType?: string;
}


export interface DeliveryIncidentFilters {
  startDate?: string;
  endDate?: string;
  deliveryZoneId?: number;
  deliveryTeamId?: number;
  operatorId?: string;
  resolved?: boolean;
}

export interface RejectionReportFilters {
  startDate?: string;
  endDate?: string;
  deliveryZoneId?: number;
  deliveryTeamId?: number;
  operatorId?: string;
}


// En el archivo de tipos
export interface OrdersByStatusFilters {
  startDate?: string;
  endDate?: string;
  deliveryZoneId?: number;
  deliveryTeamId?: number;
  operatorId?: string;
  paymentType?: string; // Debe ser camelCase
  orderStatus?: number;
}

export enum PaymentTypeReport{
  Transfer = "transfer",
  Credit_Card = "credit_Card",
  Debit_Card = "debit_Card",
  Cash = "cash",
  Current_Account = "current_Account",
  Check = "check",
  Promissory_Note = "promissory_Note",
}

export const paymentTypeLabels: Record<PaymentTypeReport, string> = {
  [PaymentTypeReport.Transfer]: "Transferencia",
  [PaymentTypeReport.Credit_Card]: "Tarjeta de Crédito",
  [PaymentTypeReport.Debit_Card]: "Tarjeta de Débito",
  [PaymentTypeReport.Cash]: "Efectivo",
  [PaymentTypeReport.Current_Account]: "Cuenta Corriente",
  [PaymentTypeReport.Check]: "Cheque",
  [PaymentTypeReport.Promissory_Note]: "Pagaré",
};

export const orderStatusLabelsLogistic: Partial<Record<OrderStatus, string>> = {
  [OrderStatus.Pending]: "Pendiente de entrega",
  [OrderStatus.SentToBilling]: "Enviado a facturación",
  [OrderStatus.PendingResolution]: "Pendiente de resolución",
  [OrderStatus.PendingReissued]: "Pendiente de reemisión",
  [OrderStatus.ReIssued]: "Reemitido",
  [OrderStatus.Delivered]: "Entregado",
  [OrderStatus.Canceled]: "Cancelado",
  [OrderStatus.PendingIncidentResolution]: "Incidente reportado",
  [OrderStatus.IncidentResolved]: "Incidente resuelto",
};

//OrderStatusHistory FILTER: 
export interface OrderStatusHistoryFilter {
  startDate?: string;
  endDate?: string;
  oldStatus?: number;
  newStatus?: number;
  operatorId?: string;
}

export interface PendingCashVerificationFilter {
  startDate?: string;
  endDate?: string;
  operatorId?: string;
  deliveryTeamId?: number;
}
//Operator prodictivity filters: 
export interface OperatorProductivityFilterEntity {
  startDate?: string;
  endDate?: string;
  deliveryZoneId?: number;
  deliveryTeamId?: number;
  paymentType?: string;
  operatorName?: string;  
  teamName?: string;      
}

//Delivery times Filter: 
export interface DeliveryTimeFilterEntity {
  StartDate?: string; // ISO date string (yyyy-mm-dd or full ISO)
  EndDate?: string;
  DeliveryZoneId?: number | null;
  DeliveryTeamId?: number | null;
  OperatorId?: string | null;
}


//FILTRA LOS VALORES DEL PAYMENT AL ESPAÑOL: 
export const paymentTypeToNumber: Record<string, number> = {
  transfer: 0,
  credit_Card: 1,
  debit_Card: 2,
  cash: 3,
  current_Account: 4,
  check: 5,
  promissory_Note: 6,
};

// paymentTypeMapper.ts
export const mapPaymentTypeToBackend = (frontendValue: string): string | undefined => {
  const mapping: Record<string, string> = {
    "transfer": "Transfer",
    "credit_Card": "Credit_Card",
    "debit_Card": "Debit_Card",
    "cash": "Cash", 
    "current_Account": "Current_Account",
    "check": "Check",
    "promissory_Note": "Promissory_Note",
  };
  return mapping[frontendValue];
};


///
export interface DeliveryTimesFilters {
  startDate?: string;
  endDate?: string;
  deliveryZoneId?: number;
  deliveryTeamId?: number;
  onlyOnTime?: boolean;
  onlyLate?: boolean;
}