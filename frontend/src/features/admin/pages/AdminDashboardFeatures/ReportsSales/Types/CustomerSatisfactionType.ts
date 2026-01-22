export type AdminCustomerSatisfactionLevel = "Positiva" | "Negativa" | "Neutra";
import { CustomerSatisfaction } from "../../../../../sales/types/CustomerTypes";

export interface AdminCustomerSatisfactionReportItem {
  orderId: number;
  customer: string;
  email: string;
  score: number;
  level: AdminCustomerSatisfactionLevel;
  date: string;
}

export interface AdminCustomerSatisfactionPagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export const AdminMapCustomerSatisfaction = (
  level: string
): CustomerSatisfaction => {
  switch (level) {
    case "Positiva":
      return CustomerSatisfaction.Positiva;
    case "Negativa":
      return CustomerSatisfaction.Negativa;
    case "Neutra":
    default:
      return CustomerSatisfaction.Neutra;
  }
};