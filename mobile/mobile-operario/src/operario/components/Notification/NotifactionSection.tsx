import React from "react";
import { View, Text } from "react-native";
import type { DepotOrderMissingDTO } from "../../types/Missing";

interface Props {
  missingItems: DepotOrderMissingDTO[];
}

const NotificacionSection: React.FC<Props> = ({ missingItems }) => {
  
    console.log("🔍 Missing items recibidos:", missingItems); // 👈 Agregado
    if (missingItems.length === 0) {
        return (
        <View style={{ padding: 10 }}>
            <Text>No hay notificaciones de faltantes.</Text>
        </View>
        );
    }

  return (
    <View style={{ padding: 10 }}>
      {missingItems.map((missing, index) => (
        <View
          key={index}
          style={{
            backgroundColor: "#fee2e2",
            padding: 10,
            borderRadius: 10,
            marginBottom: 12,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            Faltante #{missing.MissingId}
          </Text>
          <Text>Fecha: {new Date(missing.MissingDate).toLocaleDateString()}</Text>
          {missing.MissingReason && (
            <Text>Motivo: {missing.MissingReason}</Text>
          )}
          {missing.MissingDescription && (
            <Text>Descripción: {missing.MissingDescription}</Text>
          )}
          {missing.DescriptionResolution && (
            <Text style={{ color: "green" }}>
              Resuelto: {missing.DescriptionResolution}
            </Text>
          )}
          <Text style={{ marginTop: 6, fontWeight: "bold" }}>Productos Faltantes:</Text>
          {missing.MissingItems.map((item, i) => (
            <Text key={i} style={{ marginLeft: 10 }}>
              - {item.ProductName} ({item.ProductBrand}) x {item.Quantity}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
};

export default NotificacionSection;

