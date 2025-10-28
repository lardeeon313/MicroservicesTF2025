import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LogisticOrder, DeliveryIncidentStatus } from "../../types/DeliveryOrderTypeDto";
import { ReportDeliveryIncidentRequest } from "../../types/Request";
//import { validateReportDeliveryIncident } from "../../validations/validateReportDeliveryIncident";
import { validateReportDeliveryIncident } from "../../validations/ValidateReportIncidentOrder";

type Props = {
  order: LogisticOrder;
  onSubmit: (incidentType: DeliveryIncidentStatus, notes: string) => void;
  isLoading: boolean;
};

export default function ReportIncidentComponent({ order, onSubmit, isLoading }: Props) {
  const [notes, setNotes] = useState("");
  const [incidentType, setIncidentType] = useState<DeliveryIncidentStatus>(
    DeliveryIncidentStatus.Pending
  );

  const handleSubmit = () => {
    const request: ReportDeliveryIncidentRequest = {
      logisticOrderId: order.id,
      operatorUserId: order.assignedOperatorId || "", // asegúrate que esté presente en el objeto order
      incidentType: incidentType.toString(),
      description: notes,
    };

    // 🔹 Validación externa
    const validationError = validateReportDeliveryIncident(request);

    if (validationError) {
      Alert.alert("Validación", validationError);
      return;
    }

    // ✅ Si pasa la validación, llama al callback
    onSubmit(incidentType, notes);
  };

  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        shadowColor: "#000",
        elevation: 3,
        marginHorizontal: 16,
        marginTop: 24,
        marginBottom: 40,
      }}
    >
      <Image
        source={require("../../../assetsImages/LogoVerona.png")}
        style={{ width: 80, height: 80, alignSelf: "center", marginBottom: 16 }}
        resizeMode="contain"
      />

      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>
        Reportar incidente - Pedido #{order.id}
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 4 }}>
        Cliente: {order.customer.firstName} {order.customer.lastName}
      </Text>

      <Text style={{ marginBottom: 6, fontWeight: "500" }}>Tipo de incidente:</Text>
      <View
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          marginBottom: 16,
        }}
      >
        <Picker
          selectedValue={incidentType}
          onValueChange={(value) =>
            setIncidentType(value as DeliveryIncidentStatus)
          }
        >
          <Picker.Item label="Pendiente" value={DeliveryIncidentStatus.Pending} />
          <Picker.Item label="Resuelto" value={DeliveryIncidentStatus.Resolved} />
          <Picker.Item label="Entregado" value={DeliveryIncidentStatus.Delivered} />
        </Picker>
      </View>

      <Text style={{ marginBottom: 6, fontWeight: "500" }}>
        Describa brevemente el incidente:
      </Text>
      <TextInput
        value={notes}
        onChangeText={setNotes}
        placeholder="Escriba aquí..."
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          padding: 12,
          marginBottom: 16,
          fontSize: 14,
        }}
        multiline
      />

      <TouchableOpacity
        disabled={isLoading}
        style={{
          backgroundColor: isLoading ? "#ccc" : "#EF4444",
          paddingVertical: 12,
          borderRadius: 10,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
        }}
        onPress={handleSubmit}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            Enviar Incidente
          </Text>
        )}
      </TouchableOpacity>

      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          marginTop: 20,
          padding: 12,
          backgroundColor: "#f0f7ff",
          borderRadius: 10,
          borderLeftWidth: 3,
          borderLeftColor: "#2196F3",
        }}
      >
        <Text style={{ fontSize: 16, marginRight: 8, marginTop: 1 }}>ℹ️</Text>
        <Text
          style={{
            flex: 1,
            fontSize: 13,
            color: "#555",
            lineHeight: 18,
          }}
        >
          Esta acción notificará al sistema.
        </Text>
      </View>
    </View>
  );
}
