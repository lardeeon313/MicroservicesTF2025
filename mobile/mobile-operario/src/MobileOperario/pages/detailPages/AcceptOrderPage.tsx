import React, { useState } from "react";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View, ActivityIndicator, Text } from "react-native";
import type { DepotStackParamList } from "../../types/DepotStackType";
import AcceptOrder from "../../components/detail/AcceptOrder";
import NavbarOperator from "../../components/Navbar/NavbarOperator";
import { useGetOneOrder } from "../../hocks/useGetOneOrder";
import { useOrderManagment } from "./OrderManagmentPage";
import { RejectOrderWithReasonModal } from "../../components/additional/AlertWindows/AlertManager";
import { useAuth } from "../../Login/context/useAuth";
import GetBack from "../../../components/GetBack";
import Footer from "../../../components/Footer";

import AcceptOrderModal from "@/MobileOperario/components/detail/AcceptOrderModal";
import AcceptOrderSuccessModal from "@/MobileOperario/components/detail/AccepOrderSuccessModal";

type AcceptOrderPageProp = RouteProp<DepotStackParamList, "AcceptOrder">;
type NavigationProp = NativeStackNavigationProp<DepotStackParamList>;

type SuccessType = "accept" | "reject";

const AcceptOrderPage = () => {
  const { params } = useRoute<AcceptOrderPageProp>();
  const navigation = useNavigation<NavigationProp>();

  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successType, setSuccessType] = useState<SuccessType | null>(null);

  const { userId, name, role, isAuthenticated, logout, team } = useAuth();

  const teamName = typeof team === "object" ? team?.teamName : team;

  const user =
    userId && name && role
      ? { id: userId, name, role, team: teamName ?? null }
      : null;

  const {
    order: fetchedOrder,
    loading,
    error,
  } = useGetOneOrder(params.order.depotOrderId, user?.id ?? "");

  const {
    order,
    acceptOrder,
    rejectOrder,
    showMeRejectModal,
    setShowMeRejectModal,
    ConfirmRejectWithReason,
  } = useOrderManagment(
    fetchedOrder ?? params.order,
    user?.id ?? "",
    setShowSuccessModal
  );

  const handleAcceptOrder = async () => {
    setShowAcceptModal(false);
    setSuccessType("accept");
    setShowSuccessModal(true);

    try {
      await acceptOrder();
    } catch (e) {
      console.error(e);
    }
    
  };

  const onConfirmReject = async (reason: string) => {
    const success = await ConfirmRejectWithReason(reason);

    if (success) {
      setSuccessType("reject");
      setShowSuccessModal(true);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#000" />;
  if (error) return <Text>ERROR: {error}</Text>;

  return (
    <View style={{ flex: 1 }}>
      <NavbarOperator
        user={user}
        isAuthenticated={isAuthenticated}
        logout={logout}
      />

      <View style={{ marginTop: 10, marginLeft: 10 }}>
        <GetBack />
      </View>

      <AcceptOrder
        order={order}
        onAccept={() => setShowAcceptModal(true)}
        onReject={rejectOrder}
      />

      {/* CONFIRMAR ACEPTACIÓN */}
      <AcceptOrderModal
        visible={showAcceptModal}
        onCancel={() => setShowAcceptModal(false)}
        onConfirm={handleAcceptOrder}
      />

      {/* ÉXITO (ACEPTAR / RECHAZAR) */}
      {showSuccessModal && successType && (
        <AcceptOrderSuccessModal
          visible={showSuccessModal}
          type={successType}
          onClose={() => {
            setShowSuccessModal(false);
            setSuccessType(null);
            navigation.navigate("OperatorDashboard");
          }}
        />
      )}

      {/* RECHAZO */}
      <RejectOrderWithReasonModal
        visible={showMeRejectModal}
        onCancel={() => setShowMeRejectModal(false)}
        onConfirm={onConfirmReject}
      />

      <Footer />
    </View>
  );
};

export default AcceptOrderPage;
