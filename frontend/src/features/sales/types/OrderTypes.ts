import {AddressRequest, Customer, CustomerResponse, Address } from "./CustomerTypes";

export enum OrderStatus {
    Pending = "pending",
    PendingResolution = "pendingResolution",
    PendingReissued = "pendingReissued",
    Issued = "issued",
    ReIssued = "reIssued",
    Confirmed = "confirmed",
    InPreparation = "inPreparation",
    Prepared = "prepared",
    Invoiced = "invoiced",   
    Verify = "verify",
    OnTheWay = "onTheWay",   
    Delivered = "delivered",  
    Canceled = "canceled",
    Modified = "modified",
    Verified = "verified",
    PendingCashVerification = "pendingCashVerification",
    PendingDelivery = "pendingDelivery",
    AssignmentCancelled = "assignmentCancelled",
    AssignedDelivery = "assignedDelivery",
    PendingVerification = "pendingVerification",
    CashVerified = "cashVerified",
    PendingIncidentResolution = "pendingIncidentResolution",
    IncidentResolved = "incidentResolved",
    SentToBilling = "sentToBilling"
}

export enum PaymentType {
  Transfer = "transfer",
  Credit_Card = "credit_Card",
  Debit_Card = "debit_Card",
  Cash = "cash",
  Current_Account = "current_Account",
  Check = "check",
  Promissory_Note = "promissory_Note",
}


// OrderItem en una orden registrada
export interface RegisterOrderItemRequest {
  productName: string;      // Required, MaxLength(100)
  productBrand: string;     // Required, MaxLength(100)
  quantity: number;         // Min 1
}

// Item cuando se actualiza una orden (requiere ID)
export interface UpdateOrderItemRequest {
  id: number;
  productName: string;
  productBrand: string;
  quantity: number;
}

// Request para registrar una orden
export interface RegisterOrderRequest {
  customerId: string; // Guid
  items: RegisterOrderItemRequest[];
  deliveryDate?: string; // ISO date string
  deliveryDetail?: string;
  createdByUserId?: string;  

  // O se selecciona una ya registrada
  deliveryAddressId?: number | null;   

  // O se completa manualmente
  deliveryAddress?: AddressRequest;
  //nuevo:
  paymentType?: PaymentType;

}

export interface DeleteOrderRequest {
  orderId: number;
  reason: string;
}

// Request para actualizar orden completa
export interface UpdateOrderRequest {
  orderId: number;
  customerId: string;
  deliveryDetail?: string;
  deliveryDate?: string;
  items: UpdateOrderItemRequest[];
  status: OrderStatus;

  // 👉 El backend espera siempre un objeto AddressRequest
  addressRequest: AddressRequest;
  deliveryAddress?: AddressRequest;
  //
  paymentType?: PaymentType;
}

// Solo actualizar el estado
export interface UpdateOrderStatusRequest {
  orderId: number;
  status: OrderStatus;
}

// Cancelar orden
export interface CancelOrderRequest {
  orderId: number;
  reason: string;
}

// Eliminar orden
export interface DeleteOrderRequest {
  orderId: number;
  reason: string;
}

// Orden completa que se devuelve desde el backend
export interface Order {
  id: number;
  status: OrderStatus;
  orderDate: string;
  deliveryDate?: string;
  modifiedStatusDate?: string;
  totalAmount?: number;
  paymentReceipt?: string;
  deliveryDetail?: string;
  paymentType?: PaymentType;
  customerId: string;
  customer?: Customer;
  customerFirstName?: string;
  customerLastName?: string;
  items: OrderItem[];
  //NUEVO CAMPOS : 
  deliveryAddress?: Address;
  deliveryAddressId?: string | null;
  startedDate : string;
  finishDate: string; 
  customerAddresses?: AddressRequest[],
  // Nuevo campo solo para view:
  address?: Address;
}

// Submodelo: ítems dentro de la orden devuelta
export interface OrderItem {
  id: number;
  orderId: number;
  productName: string;
  productBrand: string;
  quantity: number;
  packaging?: string;
  unitPrice?: number;
  total?: number;
}
//
export interface OrderTableData {
  id: number;
  status: OrderStatus;
  orderDate: string;
  deliveryDate?: string;
  modifiedStatusDate?: string;
  totalAmount?: number;
  paymentReceipt?: string;
  deliveryDetail?: string;
  paymentType?: PaymentType;
  customerId: string;
  customerFirstName?: string;
  customerLastName?: string;
  items: OrderItem[];
  deliveryAddress?: Address; 
}

export interface OrderDetailResponse {
  id: string;
  customer: CustomerResponse;
  deliveryDate: string;
  deliveryDetail: string;
  status: OrderStatus;
  items: {
    productName: string;
    productBrand: string;
    quantity: number;
  }[];
}

export interface SalesPerfomanceDto {
  salespersonName: string;
  totalOrders: number;
  totalUnitsSold: number;
  lastOrderDate: string;
}

export interface OrderMissingItemDto {
  id: number;
  orderItemId: number;
  productName: string;
  productBrand: string;
  packaging?: string;
  missingQuantity: number;
}

export interface OrderMissingDto {
  missingId: number;
  depotOrderId: number;
  salesOrderId: number;
  missingReason: string;
  missingDescription?: string;
  descriptionResolution?: string;
  missingDate: string;
  salesOrder: Order;
  missingItems: OrderMissingItemDto[];
}

export interface OrderItemDto {
  id: number;
  productName: string;
  productBrand: string;
  quantity: number;
}

export interface OrderReissuedRequest {
  salesOrderId: number;
  updateItems: OrderItemDto[];
  descriptionResolution: string;
}