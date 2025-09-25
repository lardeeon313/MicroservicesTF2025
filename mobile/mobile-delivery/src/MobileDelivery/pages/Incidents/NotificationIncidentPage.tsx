import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DeliveryStackParamList } from "../../types/DeliveryStackType";
import NotificationIndicentComponent from "../../components/Incidents/NotificacionIncident";
import NavbarDelivery from "../../components/Navbar/NavbarDelivery";
import Footer from "../../../components/Footer";
import GetBack from "../../../components/GetBack";

type Props = NativeStackScreenProps<DeliveryStackParamList, "NotificationIncident">;

export default function NotificationIncidentPage({ route }: Props) {
  const { orderId } = route.params;
  const [incidents, setIncidents] = useState<
    { id: number; description: string; date: string }[]
  >([]);

  // MOCK: Aquí podrías reemplazar con la llamada real a tu API
  useEffect(() => {
    const mockIncidents = [
      { id: 1, description: "Producto dañado", date: "2025-09-24" },
      { id: 2, description: "Cliente no atendió", date: "2025-09-23" },
    ];
    setIncidents(mockIncidents.filter((i) => i.id === orderId || true));
  }, [orderId]);

  const mockUser = { name: "Carlos", role: "Repartidor", team: { teamName: "Zona Oeste" } };

  return (
    <View style={{ flex: 1 }}>
      <NavbarDelivery user={mockUser} isAuthenticated={true} logout={() => {}} />
        <View style={{ marginTop: 10, marginLeft: 10}}>
            <GetBack/>
        </View>
      <NotificationIndicentComponent incidents={incidents}  orderId={orderId} />
      <Footer />
    </View>
  );
}
