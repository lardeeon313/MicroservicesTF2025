export type PaymentType = "CASH" | "TRANSFER" | "ACCOUNT";

export type OrderStatus =
  | "TO_DISTRIBUTE"
  | "DELIVERED"
  | "PENDING_VERIFIED"
  | "VERIFIED"
  | "INCIDENT"
  | "RENDERED"
  | "PAYMENT_CONFIRMED"
  | "CONFIRM"
  | "PENDING_CONFIRMED";

export type PriorityType = "HIGH" | "NORMAL" | "LOW";


export interface DeliveryOrderTypeDto {
  id: number;
<<<<<<< HEAD
  customer: string;
=======

  status: OrderStatus;
  orderDate: string; // DateTime → string ISO
  deliveryDate?: string | null;
  modifiedStatusDate?: string | null;
  totalAmount?: number | null;
  paymentReceipt?: string | null;
  deliveryDetail?: string | null;
  paymentType?: PaymentType ;

  // Cliente
  customerId: string; // Guid → string
  customer: LogisticCustomer;

  // Items
  items: LogisticOrderItem[];

  // Asignación
  assignedOperatorId?: string | null;
  assignedDeliveryTeam?: DeliveryTeam | null;
  assignedDeliveryTeamId?: number | null;

  assignedDeliveryZoneId?: number | null;
  assignedDeliveryZone?: DeliveryZone | null;

  // Dirección
  deliveryAddressId: number;
  deliveryAddress: LogisticAddress;

  //Historial y trazabilidad: 
  statusHistory: OrderStatusHistory[];
  deliveryRejections: DeliveryRejectionReason[];
  deliveryIncidents: DeliveryIncident[];

  // Trazabilidad
  depotOrderId: number;
  salesOrderId: number;
  priority: PriorityType;
  //para mapear datos en el front
  deliveryPriority?: string
  deliveryPayment?: string;
  deliveryStatus?: string; 
  deliveryIncidentStatus?:string; 
}


export interface OrderStatusHistory {
  id: number;
  orderId: number;
  oldStatus: OrderStatus;
  newStatus: OrderStatus;
  changedAt: string; // DateTime → string ISO
  averageDuration: number; // segundos
}

export interface DeliveryRejectionReason {
  id: number;
  logisticOrderId: number;
  deliveryOperatorId: string; // Guid → string
  reason: string;
  rejectedAt: string; // DateTime → string ISO
}


export interface DeliveryIncident {
  id: number;
  logisticOrderId: number;
  reportedByOperatorId: string; // Guid → string
  incidentType: string;
  description: string;
  reportedAt: string; // DateTime → string ISO
  resolved: boolean;
  resolvedAt?: string | null;
  resolutionNote?: string | null;
  deliveryIncidentStatus: DeliveryIncidentStatus;
}


export interface LogisticCustomer {
  id: string; // Guid → string
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
>>>>>>> aa9e73b (Desarrollo del mobile-delivery: implementación del código de Docker para que funcione con los demás microservicios, implementación de todos los endpoints del backend del mobile-delivery, cambios realizados en los Command Handler y en el código de Infrastructure de LogisticOrderRepository (había muchos filtros que impedían incluso traer pedidos))
  address: string;
  location: { lat: number; lng: number };
  status: OrderStatus;
  payment: PaymentType;
  priority: PriorityType;
  incidentCount?: number;
  rejectReason:string;
}
<<<<<<< HEAD
=======

export interface LogisticAddress {
  id: number;
  street: string;
  number: string;
  apartment?: string | null;

  city: string;
  province: string;
  country: string;
  postalCode?: string | null;

  latitude?: number | null;
  longitude?: number | null;
  formattedAddress?: string | null;

  createdAt: string; // DateTime → string
}

export interface LogisticOrderItem {
  id: number;
  orderId: number;
  order?: LogisticOrder;

  productName?: string | null;
  productBrand?: string | null;
  quantity: number;
  packagingType?: string | null;
  unitPrice?: number | null;

  total: number;

  salesOrderItemId: number;
  depotOrderItemId: number;
  hasIncident?: boolean;
}


export interface DeliveryZone {
  id: number;
  name: string;
  description?: string | null;
  isActive: boolean;
}

export interface DeliveryTeam {
  id: number;
  teamName: string;
  teamDescription?: string | null;
  createdAt: string;
  isActive: boolean;
}


export enum DeliveryResolvedIncidentStatus {
  Pending = 0,
  Resolved = 1,
  Delivered = 2,
}
>>>>>>> aa9e73b (Desarrollo del mobile-delivery: implementación del código de Docker para que funcione con los demás microservicios, implementación de todos los endpoints del backend del mobile-delivery, cambios realizados en los Command Handler y en el código de Infrastructure de LogisticOrderRepository (había muchos filtros que impedían incluso traer pedidos))
