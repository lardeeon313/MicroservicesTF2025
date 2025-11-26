import React from "react";
import { View, Text, ScrollView } from "react-native";
import { PackageCheck, AlertTriangle, Calendar, FileText, ClipboardList, ShoppingCart } from "lucide-react-native";
import type { DepotOrderMissingDTO } from "../../types/Missing";

interface Props {
  missingItems?: DepotOrderMissingDTO[];
}

const NotificacionSection: React.FC<Props> = ({ missingItems }) => {
  if (!missingItems || missingItems.length === 0) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 16, color: "#6b7280", flexDirection: "row", alignItems: "center" }}>
          <AlertTriangle size={18} color="#6b7280" /> Por el momento, no hay notificaciones de faltantes.
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
          
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
            <Calendar size={14} color="#6b7280" />
            <Text style={{ fontSize: 14, marginLeft: 6 }}>
              Fecha: {new Date(missing.missingDate).toLocaleString("es-AR", {
                dateStyle: "short",
                timeStyle: "short"
              })}
            </Text>
          </View>
          
          {missing.missingReason && (
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
              <ClipboardList size={14} color="#6b7280" />
              <Text style={{ fontSize: 14, marginLeft: 6 }}>
                Motivo: {missing.missingReason}
              </Text>
            </View>
          )}
          
          {missing.missingDescription && (
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
              <FileText size={14} color="#6b7280" />
              <Text style={{ fontSize: 14, marginLeft: 6, fontWeight: "bold", textDecorationLine: 'underline' }}>
                Descripción: {missing.missingDescription}
              </Text>
            </View>
          )}
          
          {missing.descriptionResolution && (
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
              <PackageCheck size={16} color="green" />
              <Text style={{ fontSize: 14, color: "green", marginLeft: 6 }}>
                Resuelto: {missing.descriptionResolution}
              </Text>
            </View>
          )}
          
          {missing.missingItems && missing.missingItems.length > 0 && (
            <View style={{ marginTop: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <ShoppingCart size={16} color="#111827" />
                <Text style={{ fontSize: 15, fontWeight: "600", marginLeft: 6, color: "#111827" }}>
                  Productos faltantes involucrados:
                </Text>
              </View>
              
              {/* Header de la tabla */}
              <View style={{
                flexDirection: 'row',
                backgroundColor: '#374151',
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              }}>
                <Text style={{ flex: 2, fontSize: 13, color: "#FFFFFF", fontWeight: '600' }}>
                  Producto
                </Text>
                <Text style={{ flex: 1, fontSize: 13, color: "#FFFFFF", fontWeight: '600', textAlign: 'center' }}>
                  Cant.
                </Text>
                <Text style={{ flex: 1.2, fontSize: 13, color: "#FFFFFF", fontWeight: '600', textAlign: 'center' }}>
                  Marca
                </Text>
                <Text style={{ flex: 1.2, fontSize: 13, color: "#FFFFFF", fontWeight: '600', textAlign: 'right' }}>
                  Envase
                </Text>
              </View>
              
              {/* Filas de la tabla */}
              {missing.missingItems.map((item, i) => {
                console.log("Item faltante:", item);
                return (
                  <View key={i} style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#F3F4F6',
                    borderBottomWidth: i === missing.missingItems.length - 1 ? 0 : 1,
                    borderBottomColor: '#E5E7EB',
                    borderBottomLeftRadius: i === missing.missingItems.length - 1 ? 8 : 0,
                    borderBottomRightRadius: i === missing.missingItems.length - 1 ? 8 : 0,
                  }}>
                    <Text style={{ flex: 2, fontSize: 14, color: "#374151", fontWeight: '500' }}>
                      {item.productName}
                    </Text>
                    <Text style={{ flex: 1, fontSize: 14, color: "#DC2626", textAlign: 'center', fontWeight: '600' }}>
                      {item.missingQuantity}
                    </Text>
                    <Text style={{ flex: 1.2, fontSize: 14, color: "#6B7280", textAlign: 'center' }}>
                      {item.productBrand}
                    </Text>
                    <Text style={{ flex: 1.2, fontSize: 14, color: "#6B7280", textAlign: 'right' }}>
                      {item.packaging}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

export default NotificacionSection;