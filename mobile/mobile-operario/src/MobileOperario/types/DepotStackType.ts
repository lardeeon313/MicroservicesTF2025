import { DepotOrderItemsReportedDto, DepotOrderMissingDTO } from "./Missing";
import { DepotOrderDTO, DepotOrderStatus } from "./OrderDTO";

export type DepotStackParamList = {
  ArmOrders?: {
    id: DepotOrderDTO['depotOrderId'];
    customer: (DepotOrderDTO['customerName'] | string);
    onVerDetalle: () => void;
    onEmitirFaltante: () => void;
    onMarcarArmado: () => void;
    onEnviarAFacturar: () => void;
    status?: DepotOrderStatus.InPreparation;
  };
  ConfirmedOrders?: {
    id:DepotOrderDTO['depotOrderId'];
    customer:(DepotOrderDTO['customerName'] | string);
    onVerDetalle: () => void;
    onEmitirFaltante:() => void;
    onMarcarArmado:()=> void;
    onAcceptOrder: () => void;
    status?: (DepotOrderStatus.Assigned | DepotOrderStatus.ReReceived);
    order?: DepotOrderDTO; 
  };
  MissingOrders?: {
    id: number;
    customer: (DepotOrderDTO['customerName'] | string);
    onVerDetalle: () => void;
    onEmitirFaltante: () => void;
    onMarcarArmado: () => void;
    status?: (DepotOrderStatus.InPreparation | DepotOrderStatus.MissingProduct); 
    missingCount: DepotOrderMissingDTO[];
    onNotifySecction: () => void;
  };
  PreparedOrders?:{
    id:number;
    customer: (DepotOrderDTO['customerName'] | string);
    onVerDetalle: () => void;
    status? : (DepotOrderStatus.Prepared | DepotOrderStatus.SentToBilling);
  }
  OperatorDashboard: undefined;
  AcceptOrder: { order: DepotOrderDTO }; 
  DetailOrder: {
    orderId: DepotOrderDTO['depotOrderId'] ;
    operatorUserId: DepotOrderDTO['assignedOperatorId']
  };
  MissingReport: {
    order:DepotOrderDTO;
  };
  NotificationPage: {
    order: DepotOrderDTO;
  };
  LoginPage : undefined;
  RegisterPage: undefined;
  OperatorFAQ: undefined;
};