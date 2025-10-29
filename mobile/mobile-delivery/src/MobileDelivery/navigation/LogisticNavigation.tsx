import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//import { DeliveryStackParamList } from "./DeliveryStackType";
import { DeliveryStackParamList } from "../types/DeliveryStackType";
//import DeliveryDashboardComponent from "../pages/Dashboard/DeliveryDashboardPage";
import DeliveryDashboardComponent from "./DeliveryDashboard";
//import ListOrdersToDistributePage from "../pages/OrdersToDistribute/ListOrdersToDistributePage";
//import ListOrdersToDistributePage from "../pages/listOrdersPages/ListOrdersToDistributePage";
//import ListOrdersToDeliveredPage from "../pages/OrdersToDelivered/ListOrdersToDeliveredPage";
//import ListOrdersToDeliveredPage from "../pages/listOrdersPages/ListOrdersToDeliveredPage";
//import ListOrdersToIncidentPage from "../pages/OrdersToIncident/ListOrdersToIncidentPage";
//import ListOrdersToIncidentPage from "../pages/listOrdersPages/ListOrdersToIncidentsPage";
//import ListOrdersToVerifiedPage from "../pages/OrdersToVerified/ListOrdersToVerifiedPage";
//import ListOrdersToVerifiedPage from "../pages/listOrdersPages/ListOrdersOnTheWayPage";
//import ListOrdersOnTheWayPage from "../pages/listOrdersPages/ListOrdersOnTheWayPage";
//import OrderDetailPage from "../pages/OrderDetail/OrderDetailPage";
import OrderDetailPage from "../pages/DetailPages/DetailPage";
//import PaymentTypeComponent from "../pages/PaymentType/PaymentTypeComponent";
import PaymentTypeComponent from "../components/PaymentType/PaymentTypeComponent";
//import IncidentsDetailPage from "../pages/IncidentDetail/IncidentsDetailPage";
import ReportIncidentPage from "../pages/Incidents/ReportIncidentPage";
//import NotificationIncidentPage from "../pages/NotificationIncident/NotificationIncidentPage";
import NotificationIncidentPage from "../pages/Incidents/NotificationIncidentPage";
//import OrdersRouteMapPage from "../pages/OrdersRouteMap/OrdersRouteMapPage";
//import OrdersRouteMapPage from "../components/ListOrders/OrdersRouteMapPage";
//import OneOrderRouteMapPage from "../pages/OneOrderRouteMap/OneOrderRouteMapPage";
import OneOrderRouteMapPage from "../components/ListOrders/OneOrderRouteMapPage";
//import OrderStatusChange from "../pages/OrderStatusChange/OrderStatusChangePage"; 
import OrderStatusChange from "../components/ListOrders/OrderStatusChange";
import OrderStatusChangePage from "../components/ListOrders/OrderStatusChangePage";
import ListOrdersToDistributePage from "../pages/listOrdersPages/ListOrdersToDistributePage";
import ConfirmAssignedOrderPage from "../pages/ConfirmPage/ConfirmAssignedOrderPage";
import RejectAssignedOrderPage from "../pages/RejectPage/RejectOrderPage";

import ListOrdersOnTheWayPage from "../pages/listOrdersPages/ListOrdersOnTheWayPage";
import ListOrdersToDeliveredPage from "../pages/listOrdersPages/ListOrdersToDeliveredPage";

import ListRejectOrdersPage from "../pages/listOrdersPages/ListOrdersToRejectPage";
import ListOrdersToIncidentPage from "../pages/listOrdersPages/ListOrdersToIncidentsPage";
import PendingCashOrdersPage from "../pages/listOrdersPages/ListOrdersPendingAndCashOrdersPage";

import { ResolveDeliveryIncidentPage } from "../pages/Incidents/ResolveIncidentPage";
import ListPendingDeliveryPage from "../pages/listOrdersPages/ListOrdersToConfirmPage";

const Stack = createNativeStackNavigator<DeliveryStackParamList>();

export default function LogisticNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DeliveryDashboardComponent} />
 
      <Stack.Screen name="OrdersToDistribute" component={ListOrdersToDistributePage} />
      <Stack.Screen name="OrdersOnTheWay" component={ListOrdersOnTheWayPage} />

      <Stack.Screen name="OrderDetail" component={OrderDetailPage} />
      <Stack.Screen name="SelectPaymentType" component={PaymentTypeComponent} />
      <Stack.Screen name="ReportIncident" component={ReportIncidentPage} />
      <Stack.Screen name="NotificationIncident" component={NotificationIncidentPage} />
      {/**
      <Stack.Screen name="OrdersRouteMap" component={OrdersRouteMapPage} />
      */}
      <Stack.Screen name="OneOrderRouteMap" component={OneOrderRouteMapPage} />
      {/* ✅ Nuevo agregado correctamente */}
      <Stack.Screen name="OrderStatusChange" component={OrderStatusChangePage} />
      {/* ✅ Nuevo agregado correctamente */}
      <Stack.Screen name="ConfirmAssignedOrder" component={ConfirmAssignedOrderPage} />
      <Stack.Screen name="RejectAssignedOrder" component={RejectAssignedOrderPage} />
      <Stack.Screen name="OrdersReject" component={ListRejectOrdersPage} />

      <Stack.Screen name='OrdersToDelivered' component={ListOrdersToDeliveredPage} />
      <Stack.Screen name='OrdersToIncidents' component={ListOrdersToIncidentPage} />
      <Stack.Screen name='OrdersPendingCashVerification' component={PendingCashOrdersPage} />
      <Stack.Screen name='ResolveDeliveryIncident' component={ResolveDeliveryIncidentPage} />
      <Stack.Screen name='OrdersToConfirm' component={ListPendingDeliveryPage} />
    </Stack.Navigator>
  );
}