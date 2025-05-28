import { CustomerStatus } from "../types/CustomerTypes";


export const CustomerStatusLabel: Record<CustomerStatus, string> = {
  [CustomerStatus.Active]: "Activo",
  [CustomerStatus.Inactive]: "Inactivo",
  [CustomerStatus.Lost]: "Perdido",
};