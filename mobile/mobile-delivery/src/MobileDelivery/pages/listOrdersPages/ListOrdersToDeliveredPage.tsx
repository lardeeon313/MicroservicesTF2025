import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text, ActivityIndicator,TouchableOpacity } from "react-native";
import NavbarDelivery from "../../components/Navbar/NavbarDelivery";
import GetBack from "../../../components/GetBack";
import Footer from "../../../components/Footer";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DeliveryStackParamList } from "../../types/DeliveryStackType";
import { LogisticOrder, OrderStatus } from "../../types/DeliveryOrderTypeDto";
import ListOrdersToDeliveredComponent from "../../components/ListOrders/ListOrdersToDelivered";
import { useAuth } from "../../Login/context/useAuth";
import { useMyDeliveredOrders } from "../../hocks/useOrdersToDelivered";
import { PriorityType } from "../../types/DeliveryOrderTypeDto";
import { Banknote } from 'lucide-react-native';
import OrdersNotFound from "../../../components/OrdersNotFound";

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

const mapStatusToSpanish = (status?: string | null ) : string => {
  switch (status?.toLowerCase()) {
    case "delivered": return "Entregado";
    case "ontheway" : return "En camino";
    case "assigneddelivery" : return "Asignado";
    case "pendingdelivery" : return "Confirmado";
    case "pendingincidentresolution": return "Pedido con Incidente No resuelto";
    case "pendingcashverification": return "En espera de verificacion...";
    case "cashverified" : return "¡Verificado por tesoreria!"
    default: return "Desconocido"
  }
}


export default function ListOrdersToDeliveredPage() {
  const navigation = useNavigation<DeliveryNavigationProp>();
  const { userId, name, role, isAuthenticated, logout, team } = useAuth();
  const { orders, loading, error } = useMyDeliveredOrders(userId ?? "");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Validación básica de sesión
  if (!isAuthenticated || !userId || !name || !role) {
    return (
      <View style={styles.center}>
        <Text>Debes iniciar sesión para ver los pedidos entregados.</Text>
      </View>
    );
  }

  const teamName = typeof team === "object" ? team?.teamName : team;
  const user = { name: name ?? "", role: role ?? "", team: teamName ?? null };

  // 🧠 Regla de negocio: mostrar mensaje según estado del pedido
  useEffect(() => {
    if (orders.length > 0) {
      const lastOrder = orders[0]; // o puedes mostrar uno general según preferencia
      showStatusMessage(lastOrder.status);
    }
  }, [orders]);

  const showStatusMessage = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Delivered:
        setStatusMessage("✅ El pedido ha sido completamente entregado sin complicaciones!");
        break;
      case OrderStatus.CashVerified:
        setStatusMessage("💰 El pedido ha sido verificado por Tesorería.");
        break;
      case OrderStatus.PendingCashVerification:
        setStatusMessage("🕓 El pedido fue procesado y enviado a Tesorería para verificar el tipo de pago en efectivo.");
        break;
      default:
        setStatusMessage(null);
        break;
    }
  };

  return (
    <View style={styles.container}>
      <NavbarDelivery 
        user={user} 
        isAuthenticated={isAuthenticated}
        logout={logout} />

      <View style={styles.backContainer}>
        <GetBack />
      </View>

      <Text style={styles.title}>Pedidos Entregados</Text>

      {/* 🔹 Botón arriba del listado */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("OrdersPendingCashVerification")}
        activeOpacity={0.8}
      >
        <View style={styles.buttonContent}>
          <Banknote size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>
            Revisa los pedidos en proceso de verificación por tesorería que hayan sido pagados en efectivo
          </Text>
          <Banknote size={20} color="#fff" style={styles.icon} />
        </View>
      </TouchableOpacity>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      )}

      {error && (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {statusMessage && (
        <View style={styles.statusContainer}>
          <Text style={styles.statusMessage}>{statusMessage}</Text>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 40 }} />
      ) : error ? (
        <OrdersNotFound
          icon="🚫"
          title="Error al cargar pedidos"
          message="Ocurrió un problema al obtener los pedidos entregados."
          buttonText="Reintentar"
          onRefresh={() => {}}
        />
      ) : orders.length === 0 ? (
        <OrdersNotFound
          icon="🚫"
          title="No hay pedidos entregados"
          message="No se encontraron pedidos entregados asignados a tu usuario."
          buttonText="Actualizar"
          onRefresh={() => {}}
        />
      ) : (
        <FlatList
          contentContainerStyle={{ padding: 16 }}
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ListOrdersToDeliveredComponent
              id={item.id}
              customer={`${item.customer.firstName} ${item.customer.lastName}`}
              address={
                item.deliveryAddress.formattedAddress ??
                `${item.deliveryAddress.street} ${item.deliveryAddress.number}, ${item.deliveryAddress.city}`
              }
              status={mapStatusToSpanish(item.status)}
              priority={mapPriority(item.deliveryPriority)}
              payment={mapPaymentToSpanish(item.paymentType)}
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
  backContainer: { marginTop: 10, marginLeft: 10 },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  center: { alignItems: "center", justifyContent: "center", marginTop: 40 },
  errorText: { color: "red", fontSize: 16, textAlign: "center" },
  statusContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#E8F5E9",
    borderWidth: 1,
    borderColor: "#81C784",
  },
  statusMessage: {
    fontSize: 16,
    color: "#2E7D32",
    textAlign: "center",
    fontWeight: "600",
  },
    button: {
    backgroundColor: "#3B82F6",
    alignSelf: "center",
    width: "90%",
    marginBottom: 15,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#3B82F6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
    lineHeight: 20,
  },
  icon: {
    marginHorizontal: 4,
  },
});
