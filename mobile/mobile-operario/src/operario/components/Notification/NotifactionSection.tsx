import React from "react";
import { View, Text, ScrollView } from "react-native";
import { ShoppingCart, PackageCheck, AlertTriangle } from "lucide-react-native";
import type { DepotOrderMissingDTO } from "../../types/Missing";

interface Props {
  missingItems?: DepotOrderMissingDTO[];
}

const NotificacionSection: React.FC<Props> = ({ missingItems }) => {
  if (!missingItems || missingItems.length === 0) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 16, color: "#6b7280", flexDirection: "row", alignItems: "center" }}>
          <AlertTriangle size={18} color="#6b7280" /> Por el momento,no hay notificaciones de faltantes.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
      {missingItems.map((missing, index) => (
        <View
          key={index}
          style={{
            backgroundColor: "#fff1f2",
            padding: 14,
            borderRadius: 12,
            marginBottom: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 3,
            borderLeftWidth: 4,
            borderLeftColor: "#dc2626",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 6 }}>
            <AlertTriangle size={20} color="#dc2626" /> Faltante #{missing.missingId}
          </Text>
          <Text style={{ fontSize: 14, marginBottom: 2 }}>
            📅 Fecha: {new Date(missing.missingDate).toLocaleDateString()}
          </Text>
          {missing.missingReason && (
            <Text style={{ fontSize: 14, marginBottom: 2 }}>
              📝 Motivo: {missing.missingReason}
            </Text>
          )}
          {missing.missingDescription && (
            <Text style={{ fontSize: 14, marginBottom: 2 }}>
              📄 Descripción: {missing.missingDescription}
            </Text>
          )}
          {missing.descriptionResolution && (
            <Text style={{ fontSize: 14, color: "green", marginBottom: 6 }}>
              <PackageCheck size={16} color="green" /> Resuelto: {missing.descriptionResolution}
            </Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

export default NotificacionSection;

