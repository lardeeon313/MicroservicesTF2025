<<<<<<< HEAD
=======
import { LogisticOrder } from "./DeliveryOrderTypeDto";
import { OrderStatus } from "./DeliveryOrderTypeDto";

export type DeliveryStackParamList = {
  Dashboard: undefined;
  OrdersToDistribute: undefined;
  OrdersToDelivered: undefined;
  OrdersToIncidents: undefined;
  OrdersToVerified: undefined;
  OrderDetail: {
    order: LogisticOrder;
  };
  SelectPaymentType: { 
    orderId: number;
    updateOrderStatus: (orderId: number, newStatus: OrderStatus) => void;
  };
  ReportIncident: { 
    orderId: number; 
  };
  NotificationIncident: {
    orderId: number;
  };
  Login: undefined;
  Register: undefined;
  OrdersRouteMap: {
    orders: LogisticOrder[];
  };
  OneOrderRouteMap: {
    order: LogisticOrder;
  };
  /** ✅ Nuevo correctamente definido */
  OrderStatusChange: {
    order: LogisticOrder;
  };
};
>>>>>>> a328cc8 (Refactorización del DeliveryMobile antes de la implementación del backend:)
