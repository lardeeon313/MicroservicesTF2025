import React from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import type { DepotStackParamList } from "../../types/DepotStackType";
import AcceptOrder from "../../components/detail/AcceptOrder";
import NavbarOperator from "../../components/Navbar/NavbarOperator";
import { View, ActivityIndicator, Text } from "react-native";
import { useGetOneOrder } from "../../hocks/useGetOneOrder";
import { useOrderManagment } from "./OrderManagmentPage";
import { RejectOrderWithReasonModal } from "../../components/additional/AlertWindows/AlertManager";
import { useAuth } from "../../Login/context/useAuth"; 
import GetBack from "../../../components/GetBack";
import Footer from "../../../components/Footer";

type AcceptOrderPageProp = RouteProp<DepotStackParamList, "AcceptOrder">;

const AcceptOrderPage = () => {
  const { params } = useRoute<AcceptOrderPageProp>();

  const { userId, name, role, isAuthenticated, logout, team } = useAuth();
      
  const teamName = typeof team === 'object' ? team?.teamName : team;
      
  const user = userId && name && role
    ? { id: userId, name, role, team: teamName ?? null } 
    : null;
  
  const { order: fetchedOrder, loading, error } = useGetOneOrder(
    params.order.depotOrderId,
    user?.id ?? "" 
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

      <View style={{ marginTop: 10, marginLeft: 10}}>
        <GetBack/>
      </View>

      <AcceptOrder
        order={order}
        onAccept={acceptOrder}
        onReject={rejectOrder} 
      />

      <RejectOrderWithReasonModal
        visible={showMeRejectModal}
        onCancel={() => setShowMeRejectModal(false)}
        onConfirm={ConfirmRejectWithReason}
      />
      <Footer/>
    </View>
  );
};

export default AcceptOrderPage;