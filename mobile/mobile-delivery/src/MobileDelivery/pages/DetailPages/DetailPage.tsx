import React from "react";
import { View, StyleSheet, ScrollView } from "react-native"; // ✅ View correcto
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DeliveryStackParamList } from "../../types/DeliveryStackType";
import DetailOrderComponent from "../../components/Detail/DetailOrder";
import NavbarDelivery from "../../components/Navbar/NavbarDelivery";
import Footer from "../../../components/Footer";
import GetBack from "../../../components/GetBack";

import { useAuth } from "../../Login/context/useAuth";
<<<<<<< HEAD
=======
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
>>>>>>> aa9e73b (Desarrollo del mobile-delivery: implementación del código de Docker para que funcione con los demás microservicios, implementación de todos los endpoints del backend del mobile-delivery, cambios realizados en los Command Handler y en el código de Infrastructure de LogisticOrderRepository (había muchos filtros que impedían incluso traer pedidos))

type OrderDetailRouteProp = RouteProp<DeliveryStackParamList, "OrderDetail">;
type OrderDetailNavigationProp = NativeStackNavigationProp<DeliveryStackParamList>;

export default function OrderDetailPage() {
  const route = useRoute<OrderDetailRouteProp>();
  const navigation = useNavigation<OrderDetailNavigationProp>();
  const { order } = route.params;


  const { name, role, team, isAuthenticated, logout } = useAuth();
  const user = {
    name: name ?? "",
    role: role ?? "",
    team: team ?? null,
  };

  return (
    <View style={styles.container}>
      <NavbarDelivery user={user} isAuthenticated={isAuthenticated} logout={logout} />

      <View style={{ marginTop: 10, marginLeft: 10 }}>
        <GetBack/>
      </View>
      {/* ScrollView para evitar cortes en pantallas chicas */}
      <ScrollView contentContainerStyle={styles.content}>
        <DetailOrderComponent
          order={order}
          onBack={() => navigation.goBack()}
        />
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});


//{ marginTop: 10, marginLeft: 10 },