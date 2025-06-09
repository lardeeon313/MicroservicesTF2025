import { Order } from "../../../sales/types/OrderTypes";

export interface BillingTimeProcess {
    OrderId: Order['id'];
    dateOrder: Order['orderDate']; 
    dateBilling: string; 
    TimeProcess : number;
}