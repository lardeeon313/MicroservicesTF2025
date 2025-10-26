import React, { useState } from "react";
import { Alert,View,Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useResolveDeliveryIncident } from "../../hocks/usePostResolveDeliveryIncident";
import { ResolveDeliveryIncidentComponent } from "../../components/Incidents/ResolveIncident";
import { ResolveDeliveryIncidentRequest } from "../../types/Request";
import { DeliveryResolvedIncidentStatus } from "../../types/DeliveryOrderTypeDto";
import NavbarDelivery from "../../components/Navbar/NavbarDelivery";
import Footer from "../../../components/Footer";
import { useAuth } from "../../Login/context/useAuth";
import GetBack from "../../../components/GetBack";

export const ResolveDeliveryIncidentPage = ({ route }: any) => {
  const { userId, name, role, isAuthenticated, logout, team } = useAuth();
  const { order, incident } = route.params;
  const navigation = useNavigation<any>();
  const { resolveIncident, isLoading } = useResolveDeliveryIncident();

    // ✅ Validación de sesión
    if (!isAuthenticated || !userId || !name || !role) {
      return (
        <View style={{}}>
          <Text>Debes iniciar sesión para ver los pedidos pendientes.</Text>
        </View>
      );
    }
  
    const teamName = typeof team === "object" ? team?.teamName : team;
    const user = { name: name ?? "", role: role ?? "", team: teamName ?? null };

  const [resolutionNotes, setResolutionNotes] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const handleResolve = async () => {
    console.log("🟦 [ResolveDeliveryIncidentPage] → Iniciando resolución de incidente...");
    console.log("📦 order recibido:", order);
    console.log("📦 incident recibido:", incident);
    console.log("📋 selectedStatus:", selectedStatus);

    if (!selectedStatus) {
      console.warn("⚠️ [ResolveDeliveryIncidentPage] → No se seleccionó un estado de resolución.");
      Alert.alert("Atención", "Debe seleccionar un estado de resolución.");
      return;
    }

    // ✅ Mapeo de string → enum numérico
    const statusMap: Record<string, DeliveryResolvedIncidentStatus> = {
      Resolved: DeliveryResolvedIncidentStatus.Resolved,       // 1
      Delivered: DeliveryResolvedIncidentStatus.Delivered, // 2
      Pending: DeliveryResolvedIncidentStatus.Pending,   // 0
    };

    const mappedStatus = statusMap[selectedStatus];
    console.log("🔢 Mapped status numérico:", mappedStatus);

    const request: ResolveDeliveryIncidentRequest = {
      incidentId: incident.id,
      logisticOrderId: order.id,
      resolutionStatus: mappedStatus,
      resolutionNotes: resolutionNotes || "Incidente resuelto correctamente",
    };

    console.log("📤 [ResolveDeliveryIncidentPage] → Enviando request final al hook:", JSON.stringify(request, null, 2));

    try {
      const result = await resolveIncident(request);
      console.log("✅ [ResolveDeliveryIncidentPage] → Resultado del hook:", result);

      Alert.alert("✅ Incidente resuelto correctamente.");
      console.log("🔙 Navegando hacia atrás...");
      navigation.goBack();
    } catch (error: any) {
      console.error("❌ [ResolveDeliveryIncidentPage] → Error detectado al resolver incidente:", error);
      Alert.alert("❌ Error al resolver incidente", error?.message || "Error desconocido");
    } finally {
      console.log("🔚 [ResolveDeliveryIncidentPage] → Ejecución finalizada.");
    }
  };

  return (
    <>
      <NavbarDelivery user={user} isAuthenticated={isAuthenticated} logout={logout} />
      <View style={{paddingHorizontal: 16,marginTop: 10,}}>
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
      <Footer />
    </>
  );
};
