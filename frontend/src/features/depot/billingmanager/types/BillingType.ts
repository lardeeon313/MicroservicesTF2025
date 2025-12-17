
export interface Billing {
    depotOrderId:string;
    orderDate: string;   
    totalAmount: number;
    billingDate: string;
    customerName: string;
    customerEmail:string;
    items?: Array<{ // Array de productos
        id: number;
        productName: string;
        quantity: number;
        packaging?: string;
        productBrand?: string;
        unitPrice?: number | null;
        total?: number;
    }>;
    Status: number;
}