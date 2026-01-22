/* =======================
   Types (alineados backend)
======================= */

export interface AdminCustomerReportRow {
  customerId: string;
  nroCustomer: string;
  fullName: string;
  paymentTypes: string[];
  address: string;
}

export interface AdminCustomerReportFilters {
  name: string;
  startDate?: string;
  endDate?: string;
  paymentType: string[];
}

/* =======================
   Mapper (SE MANTIENE)
======================= */

export const AdminSalespaymentTypeReportMapper: Record<string, string> = {
  transfer: "Transferencia",
  credit_card: "Tarjeta de crédito",
  debit_card: "Tarjeta de débito",
  cash: "Efectivo",
  current_account: "Cuenta corriente",
  check: "Cheque",
  promissory_note: "Pagaré",
};
