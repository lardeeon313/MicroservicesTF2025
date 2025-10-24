import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { useGetOrdersByStatus } from "../../hocks/useGetOdersByStatus";
import { useAuth } from "../../Login/context/useAuth";
import { LogisticOrder, OrderStatus } from "../../types/DeliveryOrderTypeDto";
import { ArrowBigRightDash } from "lucide-react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const OrdersSearchModal: React.FC<Props> = ({ visible, onClose }) => {
  const { userId } = useAuth();
  const [statusInput, setStatusInput] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [ordersData, setOrdersData] = useState<LogisticOrder[]>([]); // 👈 pedidos a mostrar

  const { orders, loading, error, refetch } = useGetOrdersByStatus(status);

  // cada vez que cambian los pedidos del hook, actualizamos el array local
  useEffect(() => {
    if (searchTriggered && orders && orders.length >= 0) {
      setOrdersData(orders);
    }
  }, [orders]);

  const statusMap: Record<string, OrderStatus> = {
    "pendiente": OrderStatus.Pending,
    "emitido": OrderStatus.Issued,
    "confirmado": OrderStatus.Confirmed,
    "en preparación": OrderStatus.InPreparation,
    "preparado": OrderStatus.Prepared,
    "enviado a facturación": OrderStatus.SentToBilling,
    "facturado": OrderStatus.Invoiced,
    "verificado": OrderStatus.Verified,
    "en camino": OrderStatus.OnTheWay,
    "entregado": OrderStatus.Delivered,
    "cancelado": OrderStatus.Canceled,
    "pendiente de resolución": OrderStatus.PendingResolution,
    "reemitido": OrderStatus.ReIssued,
    "pendiente de reemisión": OrderStatus.PendingReissued,
    "pendiente de verificación": OrderStatus.PendingVerification,
    "pendiente de entrega": OrderStatus.PendingDelivery,
    "asignacion cancelada": OrderStatus.AssignmentCancelled,
    "asignado": OrderStatus.AssignedDelivery,
    "en espera de verificacion": OrderStatus.PendingCashVerification,
    "verificado por tesoreria": OrderStatus.CashVerified,
    "pedido con incidente no resuelto": OrderStatus.PendingIncidentResolution,
    "incidente resuelto": OrderStatus.IncidentResolved,
  };

  const handleSearch = () => {
    const input = statusInput.trim().toLowerCase();

    if (!input) {
      Alert.alert("Atención", "Por favor ingresa un estado para buscar.");
      return;
    }

    const translatedStatus = statusMap[input];
    if (!translatedStatus) {
      Alert.alert(
        "Estado no reconocido",
        `No se reconoce "${statusInput}". Estados válidos: ${Object.keys(statusMap).join(", ")}`
      );
      return;
    }

    setStatus(translatedStatus);
    setSearchTriggered(true);
    refetch();
  };

  const handleCancel = () => {
    setStatusInput("");
    setStatus("");
    setSearchTriggered(false);
    setOrdersData([]); // 👈 limpia los pedidos mostrados
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Buscar pedidos por estado</Text>

          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>
              <Text style={styles.noteBold}>Nota:</Text> Escribe los estados sin espacios vacios al final
            </Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Ej: en camino, entregado, cancelado..."
            value={statusInput}
            onChangeText={setStatusInput}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={handleSearch}>
              <Text style={styles.buttonText}>Buscar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#888" }]}
              onPress={handleCancel}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#e41616" }]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>

          {loading && (
            <ActivityIndicator size="large" color="#4a9c13" style={{ marginTop: 20 }} />
          )}

          {error && (
            <Text style={{ color: "red", textAlign: "center", marginTop: 10 }}>{error}</Text>
          )}

          {!loading && searchTriggered && ordersData.length === 0 && (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No se encontraron pedidos para el estado "{statusInput}".
            </Text>
          )}

          {!loading && ordersData.length > 0 && (
            <FlatList
              data={ordersData}
              keyExtractor={(item: LogisticOrder) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.orderItem}>
                  <Text style={{ fontWeight: "bold" }}>Pedido #{item.id}</Text>
                  <Text>
                    Cliente: {item.customer.firstName} {item.customer.lastName}
                  </Text>
                  <Text>
                    Dirección: {item.deliveryAddress.street}{" "}
                    {item.deliveryAddress.number}, {item.deliveryAddress.city}
                  </Text>
                </View>
              )}
              style={{ maxHeight: Dimensions.get("window").height * 0.6 }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  button: {
    flex: 1,
    backgroundColor: "#4a9c13",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  orderItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 8,
  },
  noteContainer: {
  backgroundColor: '#FFF9E6',
  padding: 12,
  borderRadius: 8,
  borderLeftWidth: 4,
  borderLeftColor: '#FFA500',
  marginVertical: 10,
},
noteText: {
  fontSize: 14,
  color: '#333',
  lineHeight: 20,
},
statesList: {
  marginLeft: 8,
  marginVertical: 8,
},
stateItem: {
  fontSize: 14,
  color: '#555',
  lineHeight: 24,
  marginVertical: 2,
},
noteBold: {
  fontWeight: 'bold',
  color: '#000',
},
});
