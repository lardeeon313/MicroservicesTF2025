// OrderDetailPage.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DeliveryStackParamList } from "../../types/DeliveryStackType";
import DetailOrderComponent from "../../components/Detail/DetailOrder";
import NavbarDelivery from "../../components/Navbar/NavbarDelivery";
import Footer from "../../../components/Footer";
import GetBack from "../../../components/GetBack";
import { useAuth } from "../../Login/context/useAuth";
import { useOrderById } from "../../hocks/useOneOrderDetail";
import { LogisticOrder, PaymentType } from "../../types/DeliveryOrderTypeDto";

// ✅ Definimos el enum y la función de mapeo dentro del mismo archivo
enum AulixiliarPriorityType {
  High = "Alta",
  Medium = "Media",
  Low = "Baja",
}

enum AuxiliarPaymentType {
  Transfer = "Tranferencia",
  Credit_Card = "Tarjeta de credito",
  Debit_Card = "Tarjeta de debito",
  Cash = "Efectivo",
  Current_Account = "Cuenta corriente",
  Check = "Cheque",
  Promissory_Note = "Pagare",
  Unknown = "Tipo de pago desconocido"
}

enum AxuziliarStatusType{
  Delivered = "Entregado",
  OnTheWay = "En camino",
  PendingDelivery = "Confirmado",
  AssignedDelivery = "Asignado",
  CashVerified = "¡Verificado por Tesoreria!",
  PendingCashVerification = "En espera de Verificacion...",
  PendingIncidentResolution = "Pendiente con Incidente No resuelto",
  Unknown = "Desconocido",

}

const mapPriority = (priority: string | undefined): AulixiliarPriorityType => {
  switch (priority?.toLowerCase()) {
    case "high":
      return AulixiliarPriorityType.High;
    case "medium":
      return AulixiliarPriorityType.Medium;
    case "low":
      return AulixiliarPriorityType.Low;
    default:
      return AulixiliarPriorityType.Low;
  }
};

const mapPaymentToSpanish = (payment: string | undefined): AuxiliarPaymentType => {
  switch (payment?.toLowerCase()) {
    case "credit_card": 
      return AuxiliarPaymentType.Credit_Card;
    case "debit_card":
      return AuxiliarPaymentType.Debit_Card;
    case "transfer":
      return AuxiliarPaymentType.Transfer;
    case "cash":
      return AuxiliarPaymentType.Cash;
    case "current_account":
      return AuxiliarPaymentType.Current_Account;
    case "check":
      return AuxiliarPaymentType.Check;
    case "promissory_note":
      return AuxiliarPaymentType.Promissory_Note;
    default: 
      return AuxiliarPaymentType.Unknown;
  }
}

const mayStatusToSpanish = (status: string | undefined) : AxuziliarStatusType => {
  switch(status?.toLowerCase()){
    case "delivered": 
      return AxuziliarStatusType.Delivered;
    case "ontheway":
      return AxuziliarStatusType.OnTheWay;
    case "assigneddelivery":
      return AxuziliarStatusType.AssignedDelivery;
    case "pendingdelivery":
      return AxuziliarStatusType.PendingDelivery;
    case "cashverified":
      return AxuziliarStatusType.CashVerified;
    case "pendingcashverification":
      return AxuziliarStatusType.PendingCashVerification;
    case "pendingincidentresolution":
      return AxuziliarStatusType.PendingIncidentResolution
    default: 
      return AxuziliarStatusType.Unknown;
  }
}

type OrderDetailRouteProp = RouteProp<DeliveryStackParamList, "OrderDetail">;
type OrderDetailNavigationProp = NativeStackNavigationProp<DeliveryStackParamList>;

export default function OrderDetailPage() {
  const route = useRoute<OrderDetailRouteProp>();
  const { order: orderFromParams } = route.params;
  const orderId = orderFromParams.id;
  const { userId, name, role, isAuthenticated, logout, team } = useAuth();

  if (!isAuthenticated || !userId || !name || !role) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Debes iniciar sesión para ver los pedidos con faltantes.</Text>
      </View>
    );
  }

  const teamName = typeof team === "object" ? team?.teamName : team;

  const { order, loading, error, refetch } = useOrderById(orderId);

  const user = {
    name: name ?? "",
    role: role ?? "",
    team: teamName ?? "N/A",
  };
  

  // ✅ Mapeamos deliveryPriority antes de pasarla al componente
  const orderWithMappedPriority = order ? {
    ...order,
    deliveryPriority: mapPriority(order.deliveryPriority),
    deliveryStatus: mayStatusToSpanish(order.status), 
    deliveryPayment: mapPaymentToSpanish(order.paymentType),
    
  } : null;

  return (
    <View style={styles.container}>
      <NavbarDelivery user={user} isAuthenticated={isAuthenticated} logout={logout} />
      <View style={{ marginTop: 10, marginLeft: 10 }}>
        <GetBack />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <DetailOrderComponent
          order={orderWithMappedPriority}
          loading={loading}
          error={error}
        />
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  content: { flexGrow: 1, paddingBottom: 20 },
});