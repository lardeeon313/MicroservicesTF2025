export enum OrderStatus {
  Pending = "Pending",
  Issued = "Issued",
  Confirmed = "Confirmed",
  InPreparation = "InPreparation",
  Prepared = "Prepared",
  SentToBilling = "SentToBilling",
  Invoiced = "Invoiced",
  Verify = "Verify",
  OnTheWay = "OnTheWay",
  Delivered = "Delivered",
  Canceled = "Canceled",
  PendingResolution = "PendingResolution",
  ReIssued = "ReIssued",
  PendingReissued = "PendingReissued",
  PendingVerification = "PendingVerification",
  WithIncidents = "WithIncidents"
}

export enum PaymentType {
  Transfer = "Transfer",
  Credit_Card = "Credit_Card",
  Debit_Card = "Debit_Card",
  Cash = "Cash",
  Current_Account = "Current_Account",
  Check = "Check",
  Promissory_Note = "Promissory_Note",
}



export enum PriorityType {
  HIGH = "HIGH",
  NORMAL = "NORMAL",
  LOW = "LOW",
}
  
export interface LogisticOrder {
  id: number;

  status: OrderStatus;
  orderDate: string; // DateTime → string ISO
  deliveryDate?: string | null;
  modifiedStatusDate?: string | null;
  totalAmount?: number | null;
  paymentReceipt?: string | null;
  deliveryDetail?: string | null;
  paymentType?: PaymentType | null;

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

  // Trazabilidad
  depotOrderId: number;
  salesOrderId: number;
  priority: PriorityType;
}


export interface LogisticCustomer {
  id: string; // Guid → string
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  registrationDate: string; // DateTime → string
  satisfactionDescription?: string | null;
  satisfactionScore?: number | null;
  addresses: LogisticAddress[];
}

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

