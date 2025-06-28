import React, { useState, useMemo } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DepotStackParamList } from "../../types/DepotStackType";
import ListOfMissingOrders from "../../components/listOrders/ListofMissingOrders";
import { DepotOrderStatus, OrderStatusMap } from "../../types/OrderDTO";
import NavbarOperator from "../../components/Navbar/NavbarOperator";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import { useReportOrderMissing } from "../../hocks/useReportOneMissing";
import type { ReportOrderMissingRequest } from "../../types/Missing";
import { useMissingOrders } from "../../hocks/useMissingOrders";
import { OrderStatusLabels } from "../../constants/UseStatusOrderOperator";

const user = {
  name: "Juan Pérez",
  role: "Operario",
  id: "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
};

const isAuthenticated = true;

const ListofMissingOrdersPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<DepotStackParamList>>();
  const { params } = useRoute<RouteProp<DepotStackParamList, "MissingOrders">>();
  const orderId = params?.id;
  

  const { missingOrders: orders, loading: loadingOrders, error } = useMissingOrders(user.id);

  const [orderStatus, setOrderStatus] = useState<DepotOrderStatus>(DepotOrderStatus.InPreparation);

  const selectedOrder = useMemo(() => {
    return orders.find(o => o.depotOrderId === orderId);
  }, [orders, orderId]);

  if (loadingOrders) {
    return <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 40 }} />;
  }

  if (!selectedOrder) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ color: "red", fontWeight: "bold" }}>
          No se encontró el pedido en preparación.
        </Text>
      </View>
    );
  }

  const onSeeDetail = () => {
    navigation.navigate("DetailOrder", {
      orderId: selectedOrder.depotOrderId,
      operatorUserId: user.id,
    });
  };

  const onNotifySection = () => {
    console.log(`NOTIFICACIONES faltantes del pedido ${selectedOrder.salesOrderId} seleccionado: ` ,selectedOrder.missings)
    navigation.navigate("NotificationPage", { order: selectedOrder });
  };

  const onEmitirFaltante = () => {
    try {
      console.log("Emitiendo faltante con order:", selectedOrder);
      navigation.navigate("MissingReport", {
        order: selectedOrder,
      });
    } catch (error) {
      console.error("Error al emitir faltante:", error);
      Alert.alert("Error", "Hubo un problema al generar el reporte de faltante.");
    }
  };

  const UpdateOrderArmed = () => {
    if (orderStatus !== DepotOrderStatus.Prepared) {
      setOrderStatus(DepotOrderStatus.Prepared);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <NavbarOperator
        user={user}
        isAuthenticated={isAuthenticated}
        logout={() => console.log("Cerrar sesión")}
      />

      <ListOfMissingOrders
        order={selectedOrder}
        onVerDetalle={onSeeDetail}
        onEmitirFaltante={onEmitirFaltante}
        onMarcarArmado={UpdateOrderArmed}
        onSeccionNotificaciones={onNotifySection}
      />
    </View>
  );
};

export default ListofMissingOrdersPage;


        {/**id={selectedOrder.depotOrderId}
        customer={selectedOrder.customerName}
        status={selectedOrder.status}
        missingCount={selectedOrder.items.map(item => ({
          orderItemId: item.id,
          productName: item.productName,
          productBrand: item.productBrand,
          packaging: item.packagingType,
          quantity: item.quantity,
        }))}**/}