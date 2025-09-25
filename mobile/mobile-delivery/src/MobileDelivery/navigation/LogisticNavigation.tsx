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
import LoginPage from "../Login/pages/LoginPage";
import RegisterPage from "../Login/pages/RegisterPage";


const Stack = createNativeStackNavigator<DeliveryStackParamList>();

export default function LogisticNavigation() {
    return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DeliveryDashboardComponent} />
      <Stack.Screen name="OrdersToDistribute" component={ListOrdersToDistributePage} />
      <Stack.Screen name='OrdersToVerified' component={ListOrdersToVerifiedPage} />
      <Stack.Screen name='OrdersToIncidents' component={ListOrdersToIncidentPage} />
      <Stack.Screen name="OrdersToDelivered" component={ListOrdersToDeliveredPage}/>
      <Stack.Screen name="OrderDetail" component={OrderDetailPage}/>
      <Stack.Screen name='SelectPaymentType' component={PaymentTypeComponent} /> 
      <Stack.Screen name='ReportIncident' component={IncidentsDetailPage} />
      <Stack.Screen name='NotificationIncident' component={NotificationIncidentPage} />
      <Stack.Screen name='Login' component={LoginPage}/>
      <Stack.Screen name='Register' component={RegisterPage}/>
    </Stack.Navigator>
  );
}
