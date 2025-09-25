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
  customer: string;
  address: string;
  location: { lat: number; lng: number };
  status: OrderStatus;
  payment: PaymentType;
  priority: PriorityType;
  incidentCount?: number;
  rejectReason:string;
}
