import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  Alert,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import NavbarDelivery from "../../components/Navbar/NavbarDelivery";
import GetBack from "../../../components/GetBack";
import Footer from "../../../components/Footer";
import ListOrdersToIncidentComponent from "../../components/ListOrders/ListOrdersToIncidents";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DeliveryStackParamList } from "../../types/DeliveryStackType";
import { useAuth } from "../../Login/context/useAuth";
import { useGetMyOrdersWithIncident } from "../../hocks/useOrdersWithIncidentes";
import OrdersNotFound from "../../../components/OrdersNotFound";

type DeliveryNavigationProp = NativeStackNavigationProp<DeliveryStackParamList>;

// 🔹 Traducciones y mapeos
const mapStatusToSpanish = (status?: string | null): string => {
  switch (status?.toLowerCase()) {
    case "delivered":
      return "Entregado";
    case "ontheway":
      return "En camino";
    case "assigneddelivery":
      return "Asignado";
    case "pendingdelivery":
      return "Confirmado";
    case "pendingincidentresolution":
      return "Pedido con Incidente No resuelto";
    case "incidentresolved":
      return "Pedido con Incidente Resuelto";
    default:
      return "Desconocido";
  }
};

const mapPriority = (priority?: string): string => {
  switch (priority?.toLowerCase()) {
    case "high":
      return "Urgente";
    case "medium":
      return "Media";
    case "low":
      return "Baja";
    default:
      return "Prioridad Desconocida";
  }
};

const mapIncidentStatusToSpanish = (deliveryIncidentStatus?: string): string => {
  switch (deliveryIncidentStatus?.toLowerCase()) {
    case "pending":
      return "Pendiente";
    case "resolved":
      return "Resuelto";
    case "delivered":
      return "Entregado";
    default:
      return "No especificado";
  }
};

const mapPaymentToSpanish = (payment?: string | null): string => {
  switch (payment?.toLowerCase()) {
    case "credit_card":
      return "Tarjeta de crédito";
    case "debit_card":
      return "Tarjeta de débito";
    case "transfer":
      return "Transferencia";
    case "cash":
      return "Efectivo";
    case "current_account":
      return "Cuenta corriente";
    case "check":
      return "Cheque";
    case "promissory_note":
      return "Pagaré";
    default:
      return "Desconocido";
  }
};

export default function ListOrdersToIncidentPage() {
  const navigation = useNavigation<DeliveryNavigationProp>();
  const [modalVisible, setModalVisible] = useState(false);
  const [resolutionsModalVisible, setResolutionsModalVisible] = useState(false);
  const [selectedIncidents, setSelectedIncidents] = useState<any[]>([]);
  const [selectedResolutions, setSelectedResolutions] = useState<any[]>([]);

  const { userId, name, role, isAuthenticated, logout, team } = useAuth();

  if (!isAuthenticated || !userId || !name || !role) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Debes iniciar sesión para ver los pedidos entregados.</Text>
      </View>
    );
  }

  const teamName = typeof team === "object" ? team?.teamName : team;

  const { orders, loading, error, refetch } = useGetMyOrdersWithIncident(userId);

  const user = {
    name: name ?? "",
    role: role ?? "",
    team: teamName ?? null,
  };

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error, [{ text: "Reintentar", onPress: refetch }]);
    }
  }, [error]);

  return (
    <View style={styles.container}>
      <NavbarDelivery user={user} isAuthenticated={isAuthenticated} logout={logout} />

      <View style={styles.backContainer}>
        <GetBack />
      </View>

      <Text style={styles.title}>Pedidos con Incidentes</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 40 }} />
      ) : orders.length === 0 ? (
        <OrdersNotFound
          icon="🚫"
          title="No hay pedidos con incidentes"
          message="No se encontraron pedidos con incidentes. Vuelve a intentarlo más tarde."
          buttonText="Actualizar"
          onRefresh={refetch}
        />
      ) : (
        <FlatList
          contentContainerStyle={{ padding: 16 }}
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const lastIncident = item.deliveryIncidents?.length
              ? item.deliveryIncidents[item.deliveryIncidents.length - 1]
              : null;

            const incidentDisplay = lastIncident
              ? `${lastIncident.incidentType} - ${mapIncidentStatusToSpanish(
                  lastIncident.deliveryIncidentStatus
                )}`
              : "Sin incidentes";

            return (
              <ListOrdersToIncidentComponent
                id={item.id}
                customer={`${item.customer.firstName} ${item.customer.lastName}`}
                address={
                  item.deliveryAddress.formattedAddress ??
                  `${item.deliveryAddress.street} ${item.deliveryAddress.number}, ${item.deliveryAddress.city}`
                }
                status={mapStatusToSpanish(item.status)}
                incidentstatus={incidentDisplay}
                priority={mapPriority(item.deliveryPriority ?? "Sin prioridad")}
                payment={mapPaymentToSpanish(
                  item.deliveryPayment || item.paymentType?.toString() || "No especificado"
                )}
                incidentCount={item.deliveryIncidents?.length || 0}
                onSeeDetail={() => navigation.navigate("OrderDetail", { order: item })}
                onResolveIncident={() =>
                  navigation.navigate("ResolveDeliveryIncident", {
                    order: item,
                    incident: lastIncident,
                  })
                }
                onViewIncidents={() => {
                  setSelectedIncidents(item.deliveryIncidents || []);
                  setModalVisible(true);
                }}
                onViewResolutions={() => {
  const resolved = item.deliveryIncidents?.filter(
    (i) => i.resolvedAt !== null || i.resolutionNote !== null
  ) || [];
  setSelectedResolutions(resolved);
  setResolutionsModalVisible(true);
}}

                onOpenInMap={() => navigation.navigate("OneOrderRouteMap", { order: item })}
              />
            );
          }}
        />
      )}

      {/* 🔍 Modal: Incidentes */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Incidentes del Pedido</Text>
            <ScrollView style={{ maxHeight: 400 }}>
              {selectedIncidents.length > 0 ? (
                selectedIncidents.map((incident, index) => (
                  <View key={index} style={styles.incidentCard}>
                    <Text style={styles.incidentText}>
                      <Text style={styles.bold}>Tipo:</Text> {incident.incidentType}
                    </Text>
                    <Text style={styles.incidentText}>
                      <Text style={styles.bold}>Estado:</Text>{" "}
                      {mapIncidentStatusToSpanish(incident.deliveryIncidentStatus)}
                    </Text>
                    {incident.description && (
                      <Text style={styles.incidentText}>
                        <Text style={styles.bold}>Descripción:</Text> {incident.description}
                      </Text>
                    )}
                    <Text style={styles.incidentText}>
                      <Text style={styles.bold}>Fecha:</Text>{" "}
                      {new Date(incident.reportedAt).toLocaleString("es-AR")}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={{ textAlign: "center", color: "#555" }}>
                  No hay incidentes registrados.
                </Text>
              )}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 🟢 Modal: Resoluciones */}
      <Modal
        visible={resolutionsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setResolutionsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Resoluciones del Pedido</Text>
            <ScrollView style={{ maxHeight: 400 }}>
              {selectedResolutions.length > 0 ? (
                selectedResolutions.map((incident, index) => (
                  <View key={index} style={styles.incidentCard}>
                    <Text style={styles.incidentText}>
                      <Text style={styles.bold}>Estado:</Text>{" "}
                      {mapIncidentStatusToSpanish(incident.deliveryIncidentStatus)}
                    </Text>
                    <Text style={styles.incidentText}>
                      <Text style={styles.bold}>Fecha de resolución:</Text>{" "}
                      {incident.resolvedAt
                        ? new Date(incident.resolvedAt).toLocaleString("es-AR")
                        : "Sin fecha"}
                    </Text>
                    <Text style={styles.incidentText}>
                      <Text style={styles.bold}>Nota:</Text>{" "}
                      {incident.resolutionNote ?? "Sin nota registrada"}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={{ textAlign: "center", color: "#555" }}>
                  No hay resoluciones registradas.
                </Text>
              )}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setResolutionsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Footer />
    </View>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  backContainer: { marginTop: 10, marginLeft: 10 },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    color: "#111827",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
    color: "#1F2937",
  },
  incidentCard: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  incidentText: {
    fontSize: 15,
    color: "#374151",
    marginBottom: 4,
  },
  bold: { fontWeight: "bold" },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#3B82F6",
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});
