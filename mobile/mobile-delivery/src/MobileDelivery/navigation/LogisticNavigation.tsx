import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DeliveryStackParamList } from "../types/DeliveryStackType";
import DeliveryDashboardComponent from "./DeliveryDashboard";
import ListOrdersToDistributePage from "../pages/listOrdersPages/ListOrdersToDistributePage";
import OrderDetailPage from "../pages/DetailPages/DetailPage";
import ListOrdersToDeliveredPage from "../pages/listOrdersPages/ListOrdersToDeliveredPage";
import ListOrdersToVerifiedPage from "../pages/listOrdersPages/ListOrdersToVerifiedPage";
import PaymentTypeComponent from "../components/PaymentType/PaymentTypeComponent";
import ListOrdersToIncidentPage from "../pages/listOrdersPages/ListOrdersToIncidentsPage";
import IncidentsDetailPage from "../pages/Incidents/ReportIncidentPage";
import NotificationIncidentPage from "../pages/Incidents/NotificationIncidentPage";


import ListRejectOrdersPage from "../pages/listOrdersPages/ListOrdersToRejectPage";
import ListOrdersToIncidentPage from "../pages/listOrdersPages/ListOrdersToIncidentsPage";
import PendingCashOrdersPage from "../pages/listOrdersPages/ListOrdersPendingAndCashOrdersPage";

import { ResolveDeliveryIncidentPage } from "../pages/Incidents/ResolveIncidentPage";

const Stack = createNativeStackNavigator<DeliveryStackParamList>();

export default function LogisticNavigation() {
    return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DeliveryDashboardComponent} />
      <Stack.Screen name="OrdersToDistribute" component={ListOrdersToDistributePage} />
<<<<<<< HEAD
      <Stack.Screen name='OrdersToVerified' component={ListOrdersToVerifiedPage} />
      <Stack.Screen name='OrdersToIncidents' component={ListOrdersToIncidentPage} />
      <Stack.Screen name="OrdersToDelivered" component={ListOrdersToDeliveredPage}/>
      <Stack.Screen name="OrderDetail" component={OrderDetailPage}/>
      <Stack.Screen name='SelectPaymentType' component={PaymentTypeComponent} /> 
      <Stack.Screen name='ReportIncident' component={IncidentsDetailPage} />
      <Stack.Screen name='NotificationIncident' component={NotificationIncidentPage} />
=======
      <Stack.Screen name="OrdersOnTheWay" component={ListOrdersOnTheWayPage} />
      {/** 
      <Stack.Screen name="OrdersToIncidents" component={ListOrdersToIncidentPage} />
      */}
      {/**
      <Stack.Screen name="OrdersToDelivered" component={ListOrdersToDeliveredPage} />
      */}
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
>>>>>>> aa9e73b (Desarrollo del mobile-delivery: implementación del código de Docker para que funcione con los demás microservicios, implementación de todos los endpoints del backend del mobile-delivery, cambios realizados en los Command Handler y en el código de Infrastructure de LogisticOrderRepository (había muchos filtros que impedían incluso traer pedidos))
    </Stack.Navigator>
  );
}
