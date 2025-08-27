import React from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import type { DepotStackParamList } from "../../types/DepotStackType";
import AcceptOrder from "../../components/detail/AcceptOrder";
import NavbarOperator from "../../components/Navbar/NavbarOperator";
import { View, ActivityIndicator, Text } from "react-native";
import { useGetOneOrder } from "../../hocks/useGetOneOrder";
import { useOrderManagment } from "./OrderManagmentPage";
import { RejectOrderWithReasonModal } from "../../components/additional/AlertWindows/AlertManager";
import { useAuth } from "../../../Login/context/useAuth"; // 👈 Importar el contexto real

//MODIFICADO PARA EL USO DEL AUTH: 

type AcceptOrderPageProp = RouteProp<DepotStackParamList, "AcceptOrder">;

const AcceptOrderPage = () => {
  const { params } = useRoute<AcceptOrderPageProp>();

  // 👇 traemos el usuario desde el contexto
  const { userId, name, role, isAuthenticated, logout } = useAuth();
  const user = userId && name && role ? { id: userId, name, role } : null;

  // 👇 usamos el id real del operario para pedir la orden
  const { order: fetchedOrder, loading, error } = useGetOneOrder(
    params.order.depotOrderId,
    user?.id ?? "" // seguridad, si no hay user pasa string vacío
  );

  const {
    order,
    acceptOrder,
    rejectOrder,
    showMeRejectModal,
    setShowMeRejectModal,
    ConfirmRejectWithReason,
  } = useOrderManagment(fetchedOrder ?? params.order, user?.id ?? "");

  if (loading) return <ActivityIndicator size="large" color="#000" />;
  if (error) return <Text>ERROR: {error}</Text>;

  return (
    <View style={{ flex: 1 }}>
      <NavbarOperator
        user={user}
        isAuthenticated={isAuthenticated}
        logout={logout}
      />

      <AcceptOrder
        order={order}
        onAccept={acceptOrder}
        onReject={rejectOrder} // usa la del hook, que setea showMeRejectModal en true
      />

      <RejectOrderWithReasonModal
        visible={showMeRejectModal}
        onCancel={() => setShowMeRejectModal(false)}
        onConfirm={ConfirmRejectWithReason}
      />
    </View>
  );
};

export default AcceptOrderPage;
