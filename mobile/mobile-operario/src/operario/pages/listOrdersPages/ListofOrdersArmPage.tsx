//LOGICA DE NEGOCIO , EN CASO DE QUE EL PEDIDO ESTE EN ESTADO DE EN PREPARACION: 
import React, { useState, useEffect } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import ListofArmOrders from "../../components/listOrders/ListofArmOrders";
import NavbarOperator from "../../components/Navbar/NavbarOperator";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DepotStackParamList } from "../../types/DepotStackType";
import { DepotOrderDTO, DepotOrderStatus } from "../../types/OrderDTO";
import { useArmOrders } from "../../hocks/useArmOrders";
import { useSendOrderToBilled } from "../../hocks/useSendOrderToBilled";
import { useAuth } from "../../../Login/context/useAuth";  // ✅ importamos el contexto de auth

const ListofOrdersArmPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<DepotStackParamList>>();

  // ✅ traemos los datos del usuario desde el contexto
  const { userId, name, role, isAuthenticated, logout } = useAuth();

  // ✅ armamos el objeto `user` si tenemos todos los datos
  const user = userId && name && role ? { id: userId, name, role } : null;

  // ✅ usamos el hook con el id del usuario si existe
  const { armOrders: orders, loading, error } = useArmOrders(user?.id ?? "");
  const { SendOrder, loading: sending } = useSendOrderToBilled();
  const [localOrders, setLocalOrders] = useState<DepotOrderDTO[]>([]);

  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  // filtramos los pedidos "En preparación"
  const ArmOrders = localOrders.filter(
    (order) => order.status === DepotOrderStatus.InPreparation
  );

  // ver detalle de un pedido
  const handleSeeDetail = (order: DepotOrderDTO) => {
    if (!user) return; // ✅ evitamos navegar si no hay usuario
    navigation.navigate("DetailOrder", {
      orderId: order.depotOrderId,
      operatorUserId: user.id,
    });
  };

  // enviar el pedido a facturación
  const handleSendOrderToBill = async (order: DepotOrderDTO) => {
    const result = await SendOrder(order.depotOrderId);
    if (result.ok) {
      Alert.alert("¡Éxito!", "El pedido fue enviado a facturación correctamente.");
      setLocalOrders((prev) =>
        prev.map((or) =>
          or.depotOrderId === order.depotOrderId
            ? { ...or, status: DepotOrderStatus.SentToBilling }
            : or
        )
      );
    } else {
      Alert.alert("Error", result.error || "Ocurrió un error al enviar a facturar.");
    }
  };

  // loading state
  if (loading) {
    return <Text style={{ padding: 16 }}>Cargando pedidos...</Text>;
  }

  if (error) {
    return <Text style={{ padding: 16, color: "red" }}>Error: {error.message}</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* ✅ ahora NavbarOperator recibe el usuario real */}
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
          letterSpacing: 0.5,
          textAlign: "center",
        }}
      >
        Pedidos para preparar
      </Text>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {ArmOrders.length === 0 ? (
          <Text style={{ fontSize: 18, textAlign: "center" }}>
            No hay pedidos armados todavía.
          </Text>
        ) : (
          ArmOrders.map((order) => (
            <ListofArmOrders
              id={order.depotOrderId}
              customer={order.customerName}
              key={order.depotOrderId}
              order={order}
              onSeeDetail={() => handleSeeDetail(order)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default ListofOrdersArmPage;

