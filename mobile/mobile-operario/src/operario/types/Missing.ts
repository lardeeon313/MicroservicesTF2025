//faltante 
import type { OrderItem } from "../../otherTypes/OrderType";

export interface Missing{
    id:number;
    product: OrderItem;
    notifyMissing : (description:string) => Notification;
}

export interface Notification {
    missingDate: Date;
    missingTimeUtc : Date; 
    description: string; 
}
