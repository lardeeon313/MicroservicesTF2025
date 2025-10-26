import React, { useMemo } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import NavbarDelivery from "../../components/Navbar/NavbarDelivery";
import GetBack from "../../../components/GetBack";
import Footer from "../../../components/Footer";
//import ListRejectOrdersComponent from "../../components/ListOrders/ListRejectOrdersComponent";
import ListRejectOrdersComponent from "../../components/ListOrders/ListOrdersToReject";
import { useAuth } from "../../Login/context/useAuth";
import { useMyRejectOrders } from "../../hocks/useGetRejectOrders";
import { LogisticOrder } from "../../types/DeliveryOrderTypeDto";

type Props = {
  operatorId?: string;
};

export default function ListRejectOrdersPage({ operatorId }: Props) {
  const { userId, name, role, isAuthenticated, logout, team } = useAuth();

  const validOperatorId = operatorId ?? userId ?? "";
  const { orders, isLoading, error } = useMyRejectOrders(validOperatorId);

    if (!isAuthenticated || !userId || !name || !role) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Debes iniciar sesión para ver los pedidos con faltantes.</Text>
        </View>
      );
    }
  
    const teamName = typeof team === "object" ? team?.teamName : team;
  
  // ✅ asegurás que name y role sean string
  const user = { 
    name: name ?? "", 
    role: role ?? "", 
    team: teamName ?? null 
  };
  


  // 🔹 Función interna para traducir prioridad
  const mapPriority = (priority?: string): string => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "Urgente";
      case "medium":
        return "Media";
      case "low":
        return "Baja";
      default:
        return "Normal";
    }
  };

  // 🔹 Función interna para traducir tipo de pago
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

  // 🔹 Función interna para traducir estado
  const mapStatusToSpanish = (status?: string | null): string => {
    switch (status?.toLowerCase()) {
      case "rejected":
        return "Rechazado";
      case "assignmentcancelled":
        return "Asignación cancelada";
      case "assigneddelivery":
        return "Asignado";
      case "ontheway":
        return "En camino";
      case "pendingdelivery":
        return "Pendiente";
      default:
        return "Desconocido";
    }
  };

  // 🔹 Transformamos las órdenes al formato que espera el componente visual
  const items = useMemo(() => {
    return (orders || []).map((o: LogisticOrder) => {
      const customerName = o.customer
        ? `${o.customer.firstName ?? ""} ${o.customer.lastName ?? ""}`.trim()
        : "Cliente desconocido";

      const address =
        o.deliveryAddress?.formattedAddress ??
        `${o.deliveryAddress?.street ?? ""} ${o.deliveryAddress?.number ?? ""}`.trim() ??
        "Sin dirección";

      const statusLabel = mapStatusToSpanish(o.status ?? o.deliveryStatus);
      const priorityLabel = mapPriority(o.deliveryPriority ?? o.priority);
      const paymentLabel = mapPaymentToSpanish(o.paymentType ?? o.deliveryPayment);

      console.log("🧩 Delivery rejections del pedido:", o.deliveryRejections);

        const rejections = (o.deliveryRejections ?? []).map((r) => ({
        id: r.id,
        logisticOrderId: o.id,
        deliveryOperatorId: r.deliveryOperatorId,
        reason: r.reason,
        rejectedAt: r.rejectedAt,
        }));


      // 🔍 Log de debug para ver si llegan los rechazos
      console.log(
        `🧾 Pedido #${o.id} → Rechazos:`,
        JSON.stringify(rejections, null, 2)
      );

      return {
        id: o.id,
        customer: customerName,
        address,
        status: statusLabel,
        priority: priorityLabel,
        payment: paymentLabel,
        rejections,
      };
    });
  }, [orders]);

  // 🔹 Estados de carga y error
  if (!isAuthenticated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Debes iniciar sesión para ver las órdenes rechazadas.</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ color: "red", textAlign: "center" }}>
          Error al obtener las órdenes rechazadas:{" "}
          {error.message ?? JSON.stringify(error)}
        </Text>
      </View>
    );
  }

  // 🔹 Render principal
  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
        <NavbarDelivery
            user={user} 
            isAuthenticated={isAuthenticated}
            logout={logout} 
        />
      <View style={{ marginTop: 10, marginLeft: 10}}><GetBack /></View>
      <Text style={{fontSize: 22, fontWeight: "600", marginTop: 20, marginBottom: 20, color: "#333", textAlign: "center"}}>Pedidos Rechazados</Text>

      <ListRejectOrdersComponent items={items} />
      <Footer />
    </View>
  );
}


//{ marginTop: 10, marginLeft: 10 }