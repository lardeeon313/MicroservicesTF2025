import { CustomerSatisfaction } from "../types/CustomerTypes";


export const CustomerSatisfactionLabel: Record<CustomerSatisfaction, string> = {
  [CustomerSatisfaction.Positiva]: "Positiva",
  [CustomerSatisfaction.Neutra]: "Neutra",
  [CustomerSatisfaction.Negativa]: "Negativa",
};