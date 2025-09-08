//page nueva: 
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { DepotStackParamList } from "../../types/DepotStackType";
import type { DepotOrderDTO } from "../../types/OrderDTO";
import { DepotOrderStatus } from "../../types/OrderDTO";
import { usePreparedOrders } from "../../hocks/usePreparedOrders";
import { useSendOrderToBilled } from "../../hocks/useSendOrderToBilled";
import ListPreparedOrders from "../../components/listOrders/ListOfPreparedOrders";
import NavbarOperator from "../../components/Navbar/NavbarOperator";
import { OrderStatusMap } from "../../types/OrderDTO";
import { useAuth } from "../../../Login/context/useAuth";


export default function ListOfPreparedOrdersPage() {
  const { userId, name, role } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<DepotStackParamList>>();
  
  // Validar que userId no sea null
  if (!userId) {
    return <Text style={{ padding: 16, color: 'red' }}>Usuario no autenticado</Text>;
  }
  
  const { preparedOrders: orders, loading, error } = usePreparedOrders(userId);
  const { SendOrder } = useSendOrderToBilled();
  const [localOrders, setLocalOrders] = useState<DepotOrderDTO[]>([]);

  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  const filteredOrders = localOrders.filter(order => {
      const status = OrderStatusMap[order.status];
      return status === DepotOrderStatus.Prepared || status === DepotOrderStatus.SentToBilling;
  });

  const handleSeeDetail = (order: DepotOrderDTO) => {
    navigation.navigate("DetailOrder", {
      orderId: order.depotOrderId,
      operatorUserId: userId,
    });
  };

  const handleSendOrderToBill = async (order: DepotOrderDTO) => {
    const result = await SendOrder(order.depotOrderId);
    if (result.ok) {
      Alert.alert("¡Éxito!", "El pedido fue enviado a facturación correctamente.");
      setLocalOrders(prev =>
        prev.map(or =>
          or.depotOrderId === order.depotOrderId
            ? { ...or, status: DepotOrderStatus.Prepared }
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
    return <Text style={{ padding: 16, color: 'red' }}>Error: {error.message}</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <NavbarOperator 
        user={{ name: name || 'Operario', role: role || 'Operario' }} 
        isAuthenticated={true} 
        logout={() => console.log("Cerrar sesión")} 
      />
      <Text style={{ fontSize: 22, fontWeight: '600', marginTop: 20, marginBottom: 20, color: '#333', textAlign: 'center' }}>
        Pedidos preparados
      </Text>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {filteredOrders.length === 0 ? (
          <Text style={{ fontSize: 18 }}>No hay pedidos preparados todavía.</Text>
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
}
