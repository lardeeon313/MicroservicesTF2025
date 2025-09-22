
import { Order } from "../../../sales/types/OrderTypes";

export interface BillingTimeProcess {
    OrderId: Order['id'];
    dateOrder: Order['orderDate']; 
    dateBilling: string; 
    TimeProcess : number;
}

export interface ProcessingTimeOrder {
  orderId: number;
  averageProcessingTime: number; // minutos
}

export interface RawOrderHistory {
  orderId: number;        // porque viene como string
  createdAt: string;      // ISO date string
  changedAt: string;      // ISO date string
  durationMinutes: number;
}