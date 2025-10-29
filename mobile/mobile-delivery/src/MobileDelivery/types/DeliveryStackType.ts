import { LogisticOrder } from "./DeliveryOrderTypeDto";
import { OrderStatus } from "./DeliveryOrderTypeDto";
import { DeliveryIncident } from "./DeliveryOrderTypeDto";

export type DeliveryStackParamList = {
  Dashboard: undefined;
  OrdersToDistribute: undefined;
  OrdersToConfirm: undefined;
  OrdersToDelivered: undefined;
  OrdersToIncidents: undefined;
  OrdersOnTheWay: undefined;
  OrdersReject: undefined; 
  OrdersPendingCashVerification: undefined;
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
  // ✅ Agrega esta línea:
  ConfirmAssignedOrder: {
    order: LogisticOrder;
  };
  RejectAssignedOrder: {
    order: LogisticOrder;
  };
  ResolveDeliveryIncident: {
    order: LogisticOrder;
    incident: DeliveryIncident | null; // 👈 agregamos el incidente
  };
};
