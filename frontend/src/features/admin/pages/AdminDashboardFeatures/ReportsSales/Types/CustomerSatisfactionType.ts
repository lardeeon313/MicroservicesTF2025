
import { CustomerSatisfaction } from "../../../../../sales/types/CustomerTypes";

/**
 * Item del reporte
 * score = nivel real 1–5
 */
export interface AdminCustomerSatisfactionReportItem {
  orderId: number;
  customer: string;
  email: string;
  score: CustomerSatisfactionLevel;
  date: string;
}

export interface AdminCustomerSatisfactionPagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

/**
 * Nivel REAL en UI
 */
export type CustomerSatisfactionLevel = 1 | 2 | 3 | 4 | 5;

/**
 * Texto UI
 */
export const SatisfactionLabels: Record<CustomerSatisfactionLevel, string> = {
  1: "Muy Malo",
  2: "Malo",
  3: "Regular",
  4: "Bueno",
  5: "Excelente",
};

/**
 * Nivel que entiende el BACKEND
 */
export type BackendSatisfactionLevel =
  | "Mala"
  | "Regular"
  | "Media"
  | "Alta";

/**
 * 🔑 MAPEO CLAVE (UI → BACK)
 */
export const mapScoreToBackendLevel = (
  score: CustomerSatisfactionLevel
): BackendSatisfactionLevel => {
  if (score <= 2) return "Mala";
  if (score === 3) return "Regular";
  if (score === 4) return "Media";
  return "Alta"; // 5
};

/**
 * (Opcional) Compatibilidad con otros badges viejos
 */
export const mapScoreToCustomerSatisfaction = (
  score?: CustomerSatisfactionLevel
): CustomerSatisfaction => {
  if (!score) return CustomerSatisfaction.Neutra;
  if (score >= 4) return CustomerSatisfaction.Positiva;
  if (score === 3) return CustomerSatisfaction.Neutra;
  return CustomerSatisfaction.Negativa;
};
