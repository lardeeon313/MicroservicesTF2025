//faltante 
import { OrderItem } from "../../../sales/types/OrderTypes";

export interface Missing{
    product: OrderItem;
    notifyMissing : (description:string) => Notification;
}

export interface Notification {
    missingDate: Date;
    missingTimeUtc : Date; 
    description: string; 
    
}
