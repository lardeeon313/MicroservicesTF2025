import { CustomerSatisfaction } from "../features/sales/types/CustomerTypes";


export const customerSatisfactionColors: Record<CustomerSatisfaction, { text: string; bg: string }> = {
  [CustomerSatisfaction.Positiva]: {
    text: "text-green-600",
    bg: "bg-green-100",
  },
  [CustomerSatisfaction.Neutra]: {
    text: "text-orange-600",
    bg: "bg-orange-100",
  },
  [CustomerSatisfaction.Negativa]: {
    text: "text-red-600",
    bg: "bg-red-100",
  }   

};