// navigation/DeliveryStackType.ts
import { DeliveryOrderTypeDto } from "./DeliveryOrderTypeDto";
import { OrderStatus } from "./DeliveryOrderTypeDto";
import { DeliveryIncident } from "./DeliveryOrderTypeDto";

export type DeliveryStackParamList = {
  Dashboard: undefined;
  OrdersToDistribute: undefined;
  OrdersToDelivered: undefined;
  OrdersToIncidents: undefined;
<<<<<<< HEAD
  OrdersToVerified: undefined;
=======
  OrdersOnTheWay: undefined;
  OrdersReject: undefined; 
  OrdersPendingCashVerification: undefined;
>>>>>>> aa9e73b (Desarrollo del mobile-delivery: implementación del código de Docker para que funcione con los demás microservicios, implementación de todos los endpoints del backend del mobile-delivery, cambios realizados en los Command Handler y en el código de Infrastructure de LogisticOrderRepository (había muchos filtros que impedían incluso traer pedidos))
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
  Login : undefined;
  Register: undefined;
<<<<<<< HEAD
};
=======
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
>>>>>>> aa9e73b (Desarrollo del mobile-delivery: implementación del código de Docker para que funcione con los demás microservicios, implementación de todos los endpoints del backend del mobile-delivery, cambios realizados en los Command Handler y en el código de Infrastructure de LogisticOrderRepository (había muchos filtros que impedían incluso traer pedidos))
