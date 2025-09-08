// Used in BillingTimeProcessTable
export type ProcessingTimeOrder = {
    orderId: string;
    averageProcessingTime: number;
};

export type RawOrderHistory = {
    orderId: string;
    durationMinutes: number;
};
import { Order } from "../../../sales/types/OrderTypes";

export interface BillingTimeProcess {
    OrderId: Order['id'];
    dateOrder: Order['orderDate']; 
    dateBilling: string; 
    TimeProcess : number;
}