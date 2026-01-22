import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ListCollapse, XIcon, BookmarkCheck } from "lucide-react-native";

type Props = {
  id: number;
  customer: string;
  address: string;
  priority: string;
  status : string; 
  payment: string;
  onConfirm: () => void;
  onReject: () => void;
  onSeeDetail: () => void;
};

export default function ListAssignedOrdersComponent({
  id,
  customer,
  address,
  priority,
  status,
  payment,
  onConfirm,
  onReject,
  onSeeDetail,
}: Props) {
  const isUrgent = priority === "Urgente";

  return (
    <View
      style={[
        styles.card,
        isUrgent && { backgroundColor: "#fff5f5", borderColor: "#e11d48" },
      ]}
    >
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.orderId}>Pedido #{id}</Text>
        {isUrgent && (
          <View style={styles.urgentBadge}>
            <Text style={styles.urgentText}>URGENTE</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.infoSection}>
        <InfoRow label="Cliente" value={customer} />
        <InfoRow label="Estado" value={status} />
        <InfoRow label="Dirección" value={address} />
        <InfoRow label="Tipo de pago" value={payment} />
        <InfoRow
          label="Prioridad"
          value={priority}
          valueStyle={{ color: isUrgent ? "#b91c1c" : "#6b7280" }}
        />
      </View>

      <View style={styles.divider} />

      {/* Botones */}
      <View style={styles.actionsSection}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.confirm, styles.flexButton]}
            onPress={onConfirm}
          >
            <BookmarkCheck size={20} color="#fff" />
            <Text style={styles.buttonText}>Confirmar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.reject, styles.flexButton]}
            onPress={onReject}
          >
            <XIcon size={20} color="#fff" />
            <Text style={styles.buttonText}>Rechazar</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, styles.detail, styles.fullButton]}
          onPress={onSeeDetail}
        >
          <ListCollapse size={20} color="#fff" />
          <Text style={styles.buttonText}>Ver Detalle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
  valueStyle?: object;
};

// 🔹 Subcomponente para evitar repetir código
const InfoRow: React.FC<InfoRowProps> = ({ label, value, valueStyle = {} }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={[styles.value, valueStyle]}>{value}</Text>
  </View>
);


const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    elevation: 3,
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  orderId: { fontSize: 18, fontWeight: "bold", color: "#1f2937" },
  urgentBadge: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  urgentText: { color: "#fff", fontSize: 11, fontWeight: "bold" },
  infoSection: { paddingHorizontal: 16, paddingBottom: 12 },
  infoRow: { flexDirection: "row", marginVertical: 4 },
  label: { width: 100, color: "#6b7280", fontWeight: "500" },
  value: { flex: 1, color: "#1f2937", fontSize: 20 },
  divider: { height: 1, backgroundColor: "#e5e7eb", marginVertical: 8 },
  actionsSection: { paddingHorizontal: 16, paddingBottom: 16, gap: 8 },
  buttonRow: { flexDirection: "row", gap: 8 },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  flexButton: { flex: 1 },
  fullButton: { width: "100%" },
  confirm: { backgroundColor: "#4a9c13" },
  reject: { backgroundColor: "#e41616" },
  detail: { backgroundColor: "#3B82F6" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
