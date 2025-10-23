import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, FlatList, ActivityIndicator, TextInput, StyleSheet, Dimensions } from "react-native";
import { useGetOrdersByStatus } from "../../hocks/useGetOdersByStatus";
import { useAuth } from "../../Login/context/useAuth";
import { LogisticOrder } from "../../types/DeliveryOrderTypeDto";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const OrdersSearchModal: React.FC<Props> = ({ visible, onClose }) => {
  const { userId } = useAuth();
  const [status, setStatus] = useState<string>(""); // minúscula
  const [searchTriggered, setSearchTriggered] = useState(false);

  const { orders, loading, error, refetch } = useGetOrdersByStatus(status);

  const handleSearch = () => {
    if (!status) return;
    setSearchTriggered(true);
    refetch();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Buscar pedidos por estado</Text>

          <TextInput
            style={styles.input}
            placeholder="Ingresa el status en minúscula"
            value={status}
            onChangeText={setStatus}
          />

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
            <TouchableOpacity style={styles.button} onPress={handleSearch}>
              <Text style={styles.buttonText}>Buscar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: "#e41616" }]} onPress={onClose}>
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>

          {loading && <ActivityIndicator size="large" color="#4a9c13" style={{ marginTop: 20 }} />}
          {error && <Text style={{ color: "red", textAlign: "center", marginTop: 10 }}>{error}</Text>}

          {!loading && searchTriggered && orders.length === 0 && (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No se encontraron pedidos para el estado "{status}".
            </Text>
          )}

          {!loading && orders.length > 0 && (
            <FlatList
              data={orders}
              keyExtractor={(item: LogisticOrder) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.orderItem}>
                  <Text style={{ fontWeight: "bold" }}>Pedido #{item.id}</Text>
                  <Text>Cliente: {item.customer.firstName} {item.customer.lastName}</Text>
                  <Text>Dirección: {item.deliveryAddress.street} {item.deliveryAddress.number}, {item.deliveryAddress.city}</Text>
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
});
