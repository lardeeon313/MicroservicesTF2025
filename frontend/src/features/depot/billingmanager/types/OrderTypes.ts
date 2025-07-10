// Tipos para Billing Manager

export interface DepotOrderItemDto {
  Id: number;
  ProductName: string;
  ProductBrand: string;
  Packaging?: string;
  UnitPrice?: number;
  Quantity: number;
  Total: number;
}

export interface DepotOrderDto {
  DepotOrderId: number;
  SalesOrderId: number;
  CustomerName: string;
  CustomerEmail: string;
  PhoneNumber: string;
  DeliveryDetail?: string;
  OrderDate: string; // ISO string
  Status: string; // Enum como string
  TotalAmount: number;
  Items: DepotOrderItemDto[];
  Missings?: any[]; // Ajustar si se usan faltantes
  AssignedOperatorId?: string;
  AssignedDepotTeam?: any; // Ajustar si se usa
  AssignedDepotTeamId?: number;
}

export const OrderStatus = {
  Pending: 'pending',
  Issued: 'issued',
  Confirmed: 'confirmed',
  InPreparation: 'inPreparation',
  Prepared: 'prepared',
  Invoiced: 'invoiced',
  Verify: 'verify',
  OnTheWay: 'onTheWay',
  Delivered: 'delivered',
  Canceled: 'canceled',
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus]; 