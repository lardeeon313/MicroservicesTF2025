import { Order,OrderStatus } from "../../otherTypes/OrderType";
import { Missing } from "./Missing";

export type DepotStackParamList = {
  ArmOrders?: {
    id: Order['id'];
    customer: Order['customerFirstName'] & Order['customerLastName'] | string;
    onVerDetalle: () => void;
    onEmitirFaltante: () => void;
    onMarcarArmado: () => void;
    status?: OrderStatus.Prepared;
  };
  ConfirmedOrders?: {
    id:Order['id'];
    customer:(Order['customerFirstName'] & Order['customerLastName']) | string;
    onVerDetalle: () => void;
    onEmitirFaltante:() => void;
    onMarcarArmado:()=> void;
    onAcceptOrder: () => void;
    status?: OrderStatus.Confirmed;
    order?: Order; // Optional order object for additional details
  };
  MissingOrders?: {
    id: Order['id'];
    customer: (Order['customerFirstName'] & Order['customerLastName']) | string;
    onVerDetalle: () => void;
    onEmitirFaltante: () => void;
    onMarcarArmado: () => void;
    status?: OrderStatus.InPreparation; // Assuming this is the status for missing orders
    missingCount: Missing[];
    onNotifySecction: () => void;
  };
  OperatorDashboard: undefined;
  AcceptOrder: { order: Order }; 
  DetailOrder: { order: Order };
  MissingReport: {
    missing: Missing;
  };
  NotificationPage: {
    order: Order;
  }
};
