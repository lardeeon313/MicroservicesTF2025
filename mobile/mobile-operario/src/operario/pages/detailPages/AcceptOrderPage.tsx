import React from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import type { DepotStackParamList } from "../../types/DepotStackType";
import AcceptOrder from "../../components/detail/AcceptOrder";
import NavbarOperator from "../../components/Navbar/NavbarOperator";
import { View, ActivityIndicator, Text } from "react-native";
import { useGetOneOrder } from "../../hocks/useGetOneOrder";
import { useOrderManagment } from "./OrderManagmentPage";
import { RejectOrderWithReasonModal } from "../../components/additional/AlertWindows/AlertManager";

const user = { name: "Juan Pérez", role: "Operario", id: "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa" };
const isAuthenticated = true;

type AcceptOrderPageProp = RouteProp<DepotStackParamList, "AcceptOrder">;

const AcceptOrderPage = () => {
  const { params } = useRoute<AcceptOrderPageProp>();
  const { order: fetchedOrder, loading, error } = useGetOneOrder(params.order.depotOrderId, user.id);

  const {
    order,
    acceptOrder,
    rejectOrder,
    showMeRejectModal,
    setShowMeRejectModal,
    ConfirmRejectWithReason,
  } = useOrderManagment(fetchedOrder ?? params.order, user.id);

  if (loading) return <ActivityIndicator size="large" color="#000" />;
  if (error) return <Text>ERROR: {error}</Text>;

  return (
    <View style={{ flex: 1 }}>
      <NavbarOperator
        user={user}
        isAuthenticated={isAuthenticated}
        logout={() => console.log("Cerrar sesión")}
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
