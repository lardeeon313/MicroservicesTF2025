import type { Order } from "./OrderTypes";

export interface EmployeeSales {
    id:string;
    firstName?:string;
    lastName?:string; 
    OrderId: string; 
    OrderDate?: string;
    OrderItems: Order[];
}