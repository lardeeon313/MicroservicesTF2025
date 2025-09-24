// navigation/DeliveryStackType.ts
import { DeliveryOrderTypeDto } from "./DeliveryOrderTypeDto";

export type DeliveryStackParamList = {
  Dashboard: undefined;
  OrdersToDistribute: undefined;
  OrdersToDelivered: undefined;
  OrdersToIncidents: undefined;
  OrdersToVerified: undefined;
  OrderDetail: {
    order: DeliveryOrderTypeDto
  };
  SelectPaymentType: { 
    orderId: number;
    updateOrderStatus: (orderId: number, newStatus: string) => void;
  };
};