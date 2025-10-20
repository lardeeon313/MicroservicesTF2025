import { PaymentType } from "../types/OrderTypes";

// Mapea el valor que viene del backend a nuestro enum
export const mapBackendPaymentTypeToEnum = (backendType: string): PaymentType => {
  const mapping: Record<string, PaymentType> = {
    Transfer: PaymentType.Transfer,
    Credit_Card: PaymentType.Credit_Card,
    Debit_Card: PaymentType.Debit_Card,
    Cash: PaymentType.Cash,
    Current_Account: PaymentType.Current_Account,
    Check: PaymentType.Check,
    Promissory_Note: PaymentType.Promissory_Note,
  };

  return mapping[backendType] || (backendType as PaymentType);
};

// Mapea el enum a su label en español
export const getPaymentTypeLabel = (paymentType: string): string => {
  if (!paymentType) return "Tipo de pago desconocido";

  // Normalizamos a minúsculas por si llega distinto
  const normalized = paymentType.toLowerCase();

  // Creamos el mapa con las versiones en minúsculas, igual que devuelve el backend
  const labels: Record<string, string> = {
    transfer: "Transferencia",
    credit_card: "Tarjeta de crédito",
    debit_card: "Tarjeta de débito",
    cash: "Efectivo",
    current_account: "Cuenta corriente",
    check: "Cheque",
    promissory_note: "Pagaré",
  };

  return labels[normalized] ?? "Tipo de pago desconocido";
};

// Mapea el enum de nuevo a lo que el backend espera
export const mapEnumPaymentTypeToBackend = (enumType: PaymentType): string => {
  const mapping: Record<PaymentType, string> = {
    [PaymentType.Transfer]: "transfer",
    [PaymentType.Credit_Card]: "credit_Card",
    [PaymentType.Debit_Card]: "debit_Card",
    [PaymentType.Cash]: "cash",
    [PaymentType.Current_Account]: "current_Account",
    [PaymentType.Check]: "check",
    [PaymentType.Promissory_Note]: "promissory_Note",
  };

  return mapping[enumType] || enumType;
};


export function normalizePaymentType(paymentType: string): PaymentType | undefined {
  const paymentTypeMap: Record<string, PaymentType> = {
    cash: PaymentType.Cash,
    transfer: PaymentType.Transfer,
    credit_card: PaymentType.Credit_Card,
    debit_card: PaymentType.Debit_Card,
    current_account: PaymentType.Current_Account,
    check: PaymentType.Check,
    promissory_note: PaymentType.Promissory_Note,
  };

  const normalizedPaymentType = paymentType.toLowerCase().replace(/\s+/g, "_");
  return paymentTypeMap[normalizedPaymentType];
}
