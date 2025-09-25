export type PaymentType = "CASH" | "CURRENT_ACCOUNT" | "TRANSFER";

export interface PaymentSelection {
  orderId: number;
  type: PaymentType;
}