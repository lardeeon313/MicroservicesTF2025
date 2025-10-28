import React, { useState } from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useResolveDeliveryIncident } from "../../hocks/usePostResolveDeliveryIncident";
import { ResolveDeliveryIncidentComponent } from "../../components/Incidents/ResolveIncident";
import { ResolveDeliveryIncidentRequest } from "../../types/Request";
import { DeliveryResolvedIncidentStatus } from "../../types/DeliveryOrderTypeDto";
import NavbarDelivery from "../../components/Navbar/NavbarDelivery";
import Footer from "../../../components/Footer";
import { useAuth } from "../../Login/context/useAuth";
import GetBack from "../../../components/GetBack";
import { Alert } from "react-native";
//import { validateResolveDeliveryIncident } from "../../validations/validateResolveDeliveryIncident";
import { validateResolveDeliveryIncident } from "../../validations/ValidateResolvedIncidentOrder";

export const ResolveDeliveryIncidentPage = ({ route }: any) => {
  const { userId, name, role, isAuthenticated, logout, team } = useAuth();
  const { order, incident } = route.params;
  const navigation = useNavigation<any>();
  const { resolveIncident, isLoading } = useResolveDeliveryIncident();

  const [resolutionNotes, setResolutionNotes] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ✅ Validación de sesión
  if (!isAuthenticated || !userId || !name || !role) {
    return (
      <View style={{ padding: 16 }}>
        <Text>Debes iniciar sesión para ver los pedidos pendientes.</Text>
      </View>
    );
  }

  const teamName = typeof team === "object" ? team?.teamName : team;
  const user = { name: name ?? "", role: role ?? "", team: teamName ?? null };

  const handleResolve = async () => {
    const statusMap: Record<string, DeliveryResolvedIncidentStatus> = {
      Resolved: DeliveryResolvedIncidentStatus.Resolved,
      Delivered: DeliveryResolvedIncidentStatus.Delivered,
      Pending: DeliveryResolvedIncidentStatus.Pending,
    };

    if (!selectedStatus) {
      setErrorMessage("Debe seleccionar un estado de resolución.");
      return;
    }

    const mappedStatus = statusMap[selectedStatus];

    const request: ResolveDeliveryIncidentRequest = {
      incidentId: incident.id,
      logisticOrderId: order.id,
      resolutionStatus: mappedStatus,
      resolutionNotes,
    };

    // 🔹 Validación externa
    const validationError = validateResolveDeliveryIncident(request);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setErrorMessage(null);

    try {
      await resolveIncident(request);
      Alert.alert("✅ Incidente resuelto correctamente.");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("❌ Error al resolver incidente", error?.message || "Error desconocido");
    }
  };

  return (
    <>
      <NavbarDelivery user={user} isAuthenticated={isAuthenticated} logout={logout} />
      <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
        <GetBack />
      </View>
      <ResolveDeliveryIncidentComponent
        order={order}
        resolutionNotes={resolutionNotes}
        onChangeNotes={setResolutionNotes}
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
        onSubmit={handleResolve}
        isLoading={isLoading}
      />
      {errorMessage && (
        <Text style={{ color: "#DC2626", fontSize: 14, marginTop: 8, textAlign: "center" }}>
          {errorMessage}
        </Text>
      )}
      <Footer />
    </>
  );
};
