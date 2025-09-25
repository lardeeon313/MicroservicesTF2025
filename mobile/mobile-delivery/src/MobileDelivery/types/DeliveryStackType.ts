// navigation/DeliveryStackType.ts
import { DeliveryOrderTypeDto } from "./DeliveryOrderTypeDto";
import { OrderStatus } from "./DeliveryOrderTypeDto";

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
    updateOrderStatus:  (orderId: number, newStatus: OrderStatus) => void;
  };
  ReportIncident: { 
    orderId: number; 
  };
  NotificationIncident: {
     orderId: number ;
  }
};