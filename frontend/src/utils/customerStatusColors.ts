import { CustomerStatus } from "../features/sales/types/CustomerTypes";


export const customerStatusColors: Record<CustomerStatus, { text: string; bg: string }> = {
  [CustomerStatus.Active]: {
    text: "text-green-600",
    bg: "bg-green-100",
  },
  [CustomerStatus.Inactive]: {
    text: "text-orange-600",
    bg: "bg-orange-100",
  },
  [CustomerStatus.Lost]: {
    text: "text-red-600",
    bg: "bg-red-100",
  }   

};