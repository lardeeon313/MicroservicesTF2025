import React from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import NavbarDelivery from "../../components/Navbar/NavbarDelivery";
import GetBack from "../../../components/GetBack";
import Footer from "../../../components/Footer";
import OrdersNotFound from "../../../components/OrdersNotFound";
import ListOrdersToDistributeComponent from "../../components/ListOrders/ListOrdersToDistribute";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DeliveryStackParamList } from "../../types/DeliveryStackType";
import { useAuth } from "../../Login/context/useAuth";
import { useMyAssignedOrders } from "../../hocks/useOrdersToDistribute";
import { LogisticOrder, PriorityType } from "../../types/DeliveryOrderTypeDto";

type DeliveryNavigationProp = NativeStackNavigationProp<DeliveryStackParamList>;

const mapPriority = (priority?: string): string => {
  switch (priority?.toLowerCase()) {
    case "high": return "Urgente";
    case "medium": return "Media";
    case "low": return "Baja";
    default: return PriorityType.Low;
  }
};

const mapPaymentToSpanish = (payment?: string | null): string => {
  switch (payment?.toLowerCase()) {
    case "credit_card": return "Tarjeta de crédito";
    case "debit_card": return "Tarjeta de débito";
    case "transfer": return "Transferencia";
    case "cash": return "Efectivo";
    case "current_account": return "Cuenta corriente";
    case "check": return "Cheque";
    case "promissory_note": return "Pagaré";
    default: return "Desconocido";
  }
}

const mapStatusToSpanish = (status?: string | null): string => {
  switch (status?.toLowerCase()) {
    case "assigneddelivery": return "Asignado";
    default: return "Desconocido";
  }
};

export default function ListAssignedOrdersPage() {
  const navigation = useNavigation<DeliveryNavigationProp>();
  const { userId, name, role, isAuthenticated, logout, team } = useAuth();
  const { orders: assignedOrders } = useMyAssignedOrders(userId ?? "");

  const teamName = typeof team === "object" ? team?.teamName : team;
  const user = { name: name ?? "", role: role ?? "", team: teamName ?? null };

  const handleConfirmOrder = (order: LogisticOrder) => {
    navigation.navigate("ConfirmAssignedOrder", { order });
  };

  const handleRejectOrder = (order: LogisticOrder) => {
    navigation.navigate("RejectAssignedOrder", { order });
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.center}>
        <Text>Debes iniciar sesión para ver los pedidos asignados.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NavbarDelivery user={user} isAuthenticated={isAuthenticated} logout={logout} />
      <View style={styles.backContainer}><GetBack /></View>
      <Text style={styles.title}>Pedidos Asignados</Text>

      {assignedOrders.length === 0 ? (
        <OrdersNotFound
          icon="📦"
          title="No tienes pedidos asignados."
          message="El encargado de tesoreria no te asignó pedidos por el momento.Vuelve a intentarlo mas tarde.."
          buttonText="Actualizar"
          onRefresh={() => {}}
        />
      ) : (
        <FlatList
          contentContainerStyle={{ padding: 16 }}
          data={assignedOrders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ListOrdersToDistributeComponent
              id={item.id}
              customer={`${item.customer.firstName} ${item.customer.lastName}`}
              address={
                item.deliveryAddress.formattedAddress ??
                `${item.deliveryAddress.street}, ${item.deliveryAddress.number}, ${item.deliveryAddress.city}`
              }
              status={mapStatusToSpanish(item.status)}
              priority={mapPriority(item.deliveryPriority)}
              payment={mapPaymentToSpanish(item.paymentType)}
              onConfirm={() => handleConfirmOrder(item)}
              onReject={() => handleRejectOrder(item)}
              onSeeDetail={() => navigation.navigate("OrderDetail", { order: item })}
            />
          )}
        />
      )}
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  backContainer: { marginTop: 10, marginLeft: 10 },
  title: { fontSize: 22, fontWeight: "700", marginVertical: 20, textAlign: "center" },
});
