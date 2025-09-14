import { Customer, CustomerResponse } from "./CustomerTypes";

export enum OrderStatus {
    Pending = "pending",
    PendingResolution = 'pendingResolution',
    PendingReissued = 'pendingReissued',
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
    Modified = "modified"
}

export enum PaymentType {
  Transfer = "Transferencia",
  Credit_Card = "Tarjeta de Credito",
  Debit_Card = "Tarjeta de Debito",
  Cash = "Efectivo",
  Current_Account = "Cuenta Corriente",
  Check = "Cheque",
  Promissory_Note = "Pagaré",
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
}

export interface DeleteOrderRequest {
  orderId: number;
  reason: string;
}

// Request para actualizar orden completa
export interface UpdateOrderRequest {
  orderId: number;
  deliveryDetail?: string;
  deliveryDate?: string;
  items: UpdateOrderItemRequest[];
  status: OrderStatus;
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
  startedDate : string;
  finishDate: string; 
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