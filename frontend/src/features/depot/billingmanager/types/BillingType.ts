import { Order } from "../../../sales/types/OrderTypes";

export interface Billing {
    orderID : Order['id']
    billingDate: string
    totalAmount: number
}