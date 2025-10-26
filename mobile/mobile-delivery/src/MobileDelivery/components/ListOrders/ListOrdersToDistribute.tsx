
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";

type Props = {
  id: number;
  customer: string;
  address: string;
  status: string;
  priority: string;
  onConfirm: () => void;
  onReject: () => void;
  onSeeDetail: () => void;
  onOpenInMap: () => void;
  onPreparation: () => void;
};

export default function ListOrdersToDistributeComponent({
  id,
  customer,
  address,
  status,
  priority,
  onConfirm,
  onReject,
  onSeeDetail,
  onOpenInMap,
  onPreparation,
}: Props) {
  const isUrgent = priority === "HIGH";

  return (
    <View
      style={[
        styles.card,
        isUrgent && { backgroundColor: "#fff5f5", borderColor: "#e11d48" },
      ]}
    >
      <Text style={styles.orderId}>Pedido #: {id}</Text>
      <Text style={styles.text}>Cliente: {customer}</Text>
      <Text style={styles.text}>Dirección: {address}</Text>
      <Text style={styles.text}>Estado: {status}</Text>
      <Text style={[styles.priority, { color: isUrgent ? "#b91c1c" : "gray" }]}>
        Prioridad: {priority}
      </Text>

      <View style={styles.buttonRow}>
        {status === "Issued" && (
          <>
            <TouchableOpacity
              style={[styles.button, styles.confirm]}
              onPress={onConfirm}
            >
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.reject]}
              onPress={onReject}
            >
              <Text style={styles.buttonText}>Rechazar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.detail]}
              onPress={onSeeDetail}
            >
              <Text style={styles.buttonText}>Ver Detalle</Text>
            </TouchableOpacity>
          </>
        )}

        {status === "Confirmed" && (
          <>
            <TouchableOpacity
              style={[styles.button, styles.preparation]}
              onPress={onPreparation}
            >
              <Text style={styles.buttonText}>In Preparation</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.detail]}
              onPress={onSeeDetail}
            >
              <Text style={styles.buttonText}>Ver Detalle</Text>
            </TouchableOpacity>
          </>
        )}

        {(status === "InPreparation" || status === "OnTheWay") && (
          <>
            <TouchableOpacity
              style={[styles.button, styles.detail]}
              onPress={onSeeDetail}
            >
              <Text style={styles.buttonText}>Ver Detalle</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.mapButton} onPress={onOpenInMap}>
              <Image
                source={require("../../../assetsImages/GoogleLogo.png")}
                style={styles.googleLogo}
              />
              <Text style={styles.mapText}>Abrir en Google Maps</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    elevation: 4,
    borderWidth: 1,
  },
  orderId: { fontSize: 18, fontWeight: "bold" },
  text: { fontSize: 16, marginTop: 4 },
  priority: { fontSize: 13, fontStyle: "italic", marginTop: 6 },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginTop: 12,
    gap: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  confirm: { backgroundColor: "#4a9c13" },
  reject: { backgroundColor: "#e41616" },
  preparation: { backgroundColor: "#f59e0b" },
  detail: { backgroundColor: "#3B82F6" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#10B981",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  googleLogo: { width: 18, height: 18, marginRight: 8, resizeMode: "contain" },
  mapText: { color: "#10B981", fontWeight: "bold", fontSize: 15 },
});




