import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import CountIncident from "../Incidents/CountIncident";
import { ListCollapse,BugOff} from 'lucide-react-native';

type Props = {
  id: number;
  customer: string;
  address: string;
  status: string;
  incidentstatus:string; 
  priority?: string;
  payment?: string;
  incidentCount: number;
  onSeeDetail: () => void;
  onResolveIncident: () => void;
  onViewIncidents: () => void;
  onOpenInMap: () => void;
};

export default function ListOrdersToIncidentComponent({
  id,
  customer,
  address,
  status,
  incidentstatus,
  priority,
  payment,
  incidentCount,
  onSeeDetail,
  onResolveIncident,
  onViewIncidents,
  onOpenInMap,
}: Props) {
  const isUrgent = priority === "Urgente";

  return (
    <View
      style={[
        styles.card,
        isUrgent && { backgroundColor: "#fff5f5", borderColor: "#e11d48" },
      ]}
    >
      {/* 🔹 Header */}
      <View style={styles.headerSection}>
        <Text style={styles.orderId}>Pedido #{id}</Text>
        {isUrgent && (
          <View style={styles.urgentBadge}>
            <Text style={styles.urgentText}>URGENTE</Text>
          </View>
        )}
      </View>

      {/* 🔹 Información */}
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Cliente:</Text>
          <Text style={styles.value}>{customer}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Estado:</Text>
          <Text style={styles.value}>{status}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Tipo de incidente provocado:</Text>
          <Text style={styles.value}>{incidentstatus}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Dirección:</Text>
          <Text style={styles.addressValue}>{address}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Tipo de pago:</Text>
          <Text style={styles.value}>{payment ?? "No especificado"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Prioridad:</Text>
          <Text
            style={[
              styles.priorityValue,
              { color: isUrgent ? "#b91c1c" : "#6b7280" },
            ]}
          >
            {priority}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Incidentes:</Text>
          <Text style={styles.value}>
            Total de reportes de incidentes: {incidentCount}
          </Text>
        </View>
      </View>

      {/* 🔹 Divider */}
      <View style={styles.divider} />

      {/* 🔹 Botones de acción */}
      <View style={styles.actionsSection}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.detail, styles.flexButton]}
            onPress={onSeeDetail}
          >
            <View style={{flexDirection: "row",alignItems: "center",}}>
              <ListCollapse size={20} color="#fff"/>
              <Text style={styles.buttonText}>Ver Detalle</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.resolve, styles.flexButton]}
            onPress={onResolveIncident}
          >
            <View style={{flexDirection: "row",alignItems: "center",}}>
              <BugOff size={20} color="#fff"/>
              <Text style={styles.buttonText}>Resolver Incidente</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, styles.map, styles.fullButton]}
          onPress={onOpenInMap}
        >
          <View style={styles.mapContent}>
            <Image
              source={require("../../../assetsImages/GoogleLogo.png")}
              style={styles.googleLogo}
            />
            <Text style={styles.buttonText}>Abrir en Google Maps</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.viewIncidents, styles.fullButton]}
          onPress={onViewIncidents}
        >
          <Text style={styles.buttonText}>⚠️ Revisar incidentes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    overflow: "hidden",
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  orderId: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  urgentBadge: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  urgentText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  infoSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  label: {
    fontSize: 15,
    color: "#6b7280",
    fontWeight: "500",
    width: 100,
    flexShrink: 0,
  },
  value: {
    fontSize: 20,
    color: "#1f2937",
    flex: 1,
  },
  addressValue: {
    fontSize: 15,
    color: "#1f2937",
    fontWeight: "600",
    flex: 1,
  },
  priorityValue: {
    fontSize: 15,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  actionsSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  flexButton: {
    flex: 1,
  },
  fullButton: {
    width: "100%",
  },
  detail: {
    backgroundColor: "#3B82F6",
  },
  resolve: {
    backgroundColor: "#e11d48",
  },
  map: {
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  mapContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  googleLogo: {
    width: 18,
    height: 18,
    marginRight: 8,
    resizeMode: "contain",
  },
  viewIncidents: {
    backgroundColor: "#b91c1c",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
});
