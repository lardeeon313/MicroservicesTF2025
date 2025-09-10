import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { DepotStackParamList } from "../../types/DepotStackType";
import type { DepotOrderDTO } from "../../types/OrderDTO";
import { DepotOrderStatus, OrderStatusMap } from "../../types/OrderDTO";
import { usePreparedOrders } from "../../hocks/usePreparedOrders";
import { useSendOrderToBilled } from "../../hocks/useSendOrderToBilled";
import ListPreparedOrders from "../../components/listOrders/ListOfPreparedOrders";
import NavbarOperator from "../../components/Navbar/NavbarOperator";

import { useAuth } from "../../Login/context/useAuth"; 


const ListOfPreparedOrdersPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<DepotStackParamList>>();

  const { userId, name, role, isAuthenticated, logout } = useAuth();


  const user = userId && name && role ? { id: userId, name, role } : null;

  const { preparedOrders: orders, loading, error } = usePreparedOrders(user?.id ?? "");

  const { SendOrder } = useSendOrderToBilled();
  const [localOrders, setLocalOrders] = useState<DepotOrderDTO[]>([]);

  useEffect(() => {
    if (orders.length > 0) {
      console.log(
        "Pedidos cargados:",
        orders.map((o) => ({ id: o.depotOrderId, status: o.status }))
      );
      setLocalOrders(orders);
    }
  }, [orders]);

 
  const filteredOrders = localOrders.filter(order => {
    const status = OrderStatusMap[order.status];
    return status === DepotOrderStatus.Prepared || status === DepotOrderStatus.SentToBilling;
  });

  const handleSeeDetail = (order: DepotOrderDTO) => {
    if (!user) return;
    navigation.navigate("DetailOrder", {
      orderId: order.depotOrderId,
      operatorUserId: user.id,
    });
  };

  const handleSendOrderToBill = async (order: DepotOrderDTO) => {
    const result = await SendOrder(order.depotOrderId);
    if (result.ok) {
      Alert.alert("¡Éxito!", "El pedido fue enviado a facturación correctamente.");
      setLocalOrders(prev =>
        prev.map(or =>
          or.depotOrderId === order.depotOrderId
            ? { ...or, status: DepotOrderStatus.SentToBilling  }
            : or
        )
      );
    } else {
      Alert.alert("Error", result.error || "Ocurrió un error al enviar a facturar.");
    }
  };

  if (loading) {
    return <Text style={{ padding: 16 }}>Cargando pedidos preparados...</Text>;
  }

  if (error) {
    return (
      <Text style={{ padding: 16, color: "red" }}>Error: {error.message}</Text>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <NavbarOperator
        user={user}
        isAuthenticated={isAuthenticated}
        logout={logout}
      />
      <Text
        style={{
          fontSize: 22,
          fontWeight: "600",
          marginTop: 20,
          marginBottom: 20,
          color: "#333",
          textAlign: "center",
        }}
      >
        Pedidos preparados
      </Text>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {filteredOrders.length === 0 ? (
          <Text style={{ fontSize: 18 }}>
            No hay pedidos preparados todavía.
          </Text>
        ) : (
          filteredOrders.map((order) => (
            <ListPreparedOrders
              key={order.depotOrderId}
              id={order.depotOrderId}
              customer={order.customerName}
              order={order}
              onSeeDetail={() => handleSeeDetail(order)}
              onSendToBill={() => handleSendOrderToBill(order)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default ListOfPreparedOrdersPage;
