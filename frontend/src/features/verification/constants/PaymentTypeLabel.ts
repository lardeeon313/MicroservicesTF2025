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
    // También aceptar valores en minúsculas del backend
    transfer: PaymentType.Transfer,
    credit_Card: PaymentType.Credit_Card,
    credit_card: PaymentType.Credit_Card,
    debit_Card: PaymentType.Debit_Card,
    debit_card: PaymentType.Debit_Card,
    cash: PaymentType.Cash,
    current_Account: PaymentType.Current_Account,
    current_account: PaymentType.Current_Account,
    check: PaymentType.Check,
    promissory_Note: PaymentType.Promissory_Note,
    promissory_note: PaymentType.Promissory_Note,
  };

  return mapping[backendType] || (backendType as PaymentType);
};

// Mapea el enum o cualquier string a su label en español normalizado
export const getPaymentTypeLabel = (paymentType: string | PaymentType | null | undefined): string => {
  if (!paymentType) return "Tipo de pago desconocido";

  // Si ya es un valor del enum (en español), devolverlo directamente
  if (typeof paymentType === 'string') {
    // Verificar si ya está en español normalizado
    const normalizedValues = [
      "Transferencia",
      "Tarjeta de Crédito",
      "Tarjeta de Débito",
      "Efectivo",
      "Cuenta Corriente",
      "Cheque",
      "Pagaré"
    ];
    
    if (normalizedValues.includes(paymentType)) {
      return paymentType;
    }

    // Normalizamos a minúsculas por si llega distinto
    const normalized = paymentType.toLowerCase().trim();

    // Creamos el mapa con las versiones en minúsculas, igual que devuelve el backend
    const labels: Record<string, string> = {
      transfer: "Transferencia",
      transferencia: "Transferencia",
      "bank transfer": "Transferencia",
      credit_card: "Tarjeta de Crédito",
      "credit card": "Tarjeta de Crédito",
      "tarjeta de credito": "Tarjeta de Crédito",
      "tarjeta de crédito": "Tarjeta de Crédito",
      debit_card: "Tarjeta de Débito",
      "debit card": "Tarjeta de Débito",
      "tarjeta de debito": "Tarjeta de Débito",
      "tarjeta de débito": "Tarjeta de Débito",
      cash: "Efectivo",
      efectivo: "Efectivo",
      current_account: "Cuenta Corriente",
      "current account": "Cuenta Corriente",
      "cuenta corriente": "Cuenta Corriente",
      check: "Cheque",
      cheque: "Cheque",
      promissory_note: "Pagaré",
      "promissory note": "Pagaré",
      pagare: "Pagaré",
      "pagaré": "Pagaré",
    };

    return labels[normalized] ?? paymentType;
  }

  // Si es un enum, mapear directamente
  const enumLabels: Record<PaymentType, string> = {
    [PaymentType.Transfer]: "Transferencia",
    [PaymentType.Credit_Card]: "Tarjeta de Crédito",
    [PaymentType.Debit_Card]: "Tarjeta de Débito",
    [PaymentType.Cash]: "Efectivo",
    [PaymentType.Current_Account]: "Cuenta Corriente",
    [PaymentType.Check]: "Cheque",
    [PaymentType.Promissory_Note]: "Pagaré",
  };

  return enumLabels[paymentType as PaymentType] ?? "Tipo de pago desconocido";
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

export function normalizePaymentType(paymentType: string | PaymentType | null | undefined): string {
  return getPaymentTypeLabel(paymentType);
}
