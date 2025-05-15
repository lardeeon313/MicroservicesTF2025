import { Customer } from "./CustomerTypes";

export enum OrderStatus {
    Pending = "Pending",
    Issued = "Issued",
    Confirmed = "Confirmed",
    InPreparation = "InPreparation",
    Prepared = "Prepared",
    Invoiced = "Invoiced",   
    Verify = "Verify",
    OnTheWay = "OnTheWay",   
    Delivered = "Delivered",  
    Canceled = "Canceled"
}

export enum PaymentType {
  Transfer = "Transfer",
  Credit_Card = "Credit_Card ",
  Debit_Card = "Debit_Card",
  Cash = "Cash",
  Current_Account = "Current_Account",
  Check = "Check",
  Promissory_Note = "Promissory_Note",
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
