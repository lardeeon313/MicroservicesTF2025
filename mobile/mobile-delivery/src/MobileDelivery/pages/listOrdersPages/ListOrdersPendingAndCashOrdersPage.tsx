import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import NavbarDelivery from "../../components/Navbar/NavbarDelivery";
import GetBack from "../../../components/GetBack";
import Footer from "../../../components/Footer";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DeliveryStackParamList } from "../../types/DeliveryStackType";
import { useAuth } from "../../Login/context/useAuth";
//import { useGetMyPendingCashOrders } from "../../hocks/useGetMyPendingCashOrders";
//import ListPendingCashOrdersComponent from "../../components/ListOrders/ListPendingCashOrdersComponent";
import ListPendingCashOrdersComponent from "../../components/ListOrders/ListOrdersPendingAndCashOrders";
import { useGetMyPendingCashOrders } from "../../hocks/usePendingCashOrders";
import { LogisticOrder } from "../../types/DeliveryOrderTypeDto";
import { Banknote } from "lucide-react-native";

type DeliveryNavigationProp = NativeStackNavigationProp<DeliveryStackParamList>;

const mapPriority = (priority?: string): string => {
  switch (priority?.toLowerCase()) {
    case "high":
      return "Urgente";
    case "medium":
      return "Media";
    case "low":
      return "Baja";
    default:
      return "Desconocido";
  }
};

const mapPaymentToSpanish = (payment?: string | null): string => {
  switch (payment?.toLowerCase()) {
    case "credit_card":
      return "Tarjeta de crédito";
    case "debit_card":
      return "Tarjeta de débito";
    case "transfer":
      return "Transferencia";
    case "cash":
      return "Efectivo";
    case "current_account":
      return "Cuenta corriente";
    case "check":
      return "Cheque";
    case "promissory_note":
      return "Pagaré";
    default:
      return "Desconocido";
  }
};

const mapStatusToSpanish = (status?: string | null): string => {
  switch (status?.toLowerCase()) {
    case "pendingcashverification":
      return "En espera de verificación...";
    case "cashverified":
      return "Verificado por Tesorería";
    case "ontheway":
      return "En camino";
    case "assigneddelivery":
      return "Asignado";
    default:
      return "Desconocido";
  }
};

export default function PendingCashOrdersPage() {
  const navigation = useNavigation<DeliveryNavigationProp>();
  const { userId, name, role, isAuthenticated, logout, team } = useAuth();
  const { orders, loading, error } = useGetMyPendingCashOrders(userId ?? "");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // ✅ Validación de sesión
  if (!isAuthenticated || !userId || !name || !role) {
    return (
      <View style={styles.center}>
        <Text>Debes iniciar sesión para ver los pedidos pendientes.</Text>
      </View>
    );
  }

  const teamName = typeof team === "object" ? team?.teamName : team;
  const user = { name: name ?? "", role: role ?? "", team: teamName ?? null };

  // 🧠 Mostrar mensaje contextual según estado
  useEffect(() => {
    if (orders.length > 0) {
      const firstOrder = orders[0];
      showStatusMessage(firstOrder.status);
    }
  }, [orders]);

  const showStatusMessage = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pendingcashverification":
        setStatusMessage("💰 Pedido pendiente de verificación por Tesorería.");
        break;
      case "cashverified":
        setStatusMessage("✅ Pedido ya verificado por Tesorería.");
        break;
      default:
        setStatusMessage(null);
        break;
    }
  };

  return (
    <View style={styles.container}>
      <NavbarDelivery user={user} isAuthenticated={isAuthenticated} logout={logout} />

      <View style={styles.backContainer}>
        <GetBack />
      </View>

      <Text style={styles.title}>Pedidos Pendientes de Verificación</Text>

      {/* 🔹 Botón de navegación a Dashboard */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Dashboard")}
        activeOpacity={0.8}
      >
        <View style={styles.buttonContent}>
          <Banknote size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>
            Volver al panel principal.
          </Text>
          <Banknote size={20} color="#fff" style={styles.icon} />
        </View>
      </TouchableOpacity>

      {/* Estado: Cargando */}
      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      )}

      {/* Estado: Error */}
      {error && (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Estado: Mensaje contextual */}
      {statusMessage && (
        <View style={styles.statusContainer}>
          <Text style={styles.statusMessage}>{statusMessage}</Text>
        </View>
      )}

      {/* Lista de pedidos */}
      {!loading && !error && (
        <FlatList
          contentContainerStyle={{ padding: 16 }}
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ListPendingCashOrdersComponent
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
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  backContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
    marginVertical: 12,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 16,
    textAlign: "center",
  },
  statusContainer: {
    marginHorizontal: 16,
    marginVertical: 10,
    backgroundColor: "#EFF6FF",
    borderLeftWidth: 4,
    borderLeftColor: "#3B82F6",
    padding: 10,
    borderRadius: 6,
  },
  statusMessage: {
    color: "#1E3A8A",
    fontSize: 15,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#3B82F6",
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
  },
  icon: {
    marginHorizontal: 4,
  },
});
