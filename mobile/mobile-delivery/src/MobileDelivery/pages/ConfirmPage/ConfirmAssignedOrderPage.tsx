import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { DeliveryStackParamList } from "../../types/DeliveryStackType";
import { useConfirmAssignedOrder } from "../../hocks/useConfirmAsssing";
import { useAuth } from "../../Login/context/useAuth";
import ConfirmOrderComponent from "../../components/ConfirmOrder/ConfirmOrder";
import NavbarDelivery from "../../components/Navbar/NavbarDelivery";
import Footer from "../../../components/Footer";
import GetBack from "../../../components/GetBack";
import { LogisticOrder } from "../../types/DeliveryOrderTypeDto";

type ConfirmAssignedOrderRouteProp = RouteProp<DeliveryStackParamList, "ConfirmAssignedOrder">;

// 🟦 TIPO UI (no rompe LogisticOrder)
export type LogisticOrderUI = LogisticOrder & {
    deliveryPriorityLabel: string;
    paymentTypeLabel: string;
    statusLabel: string;
};

export default function ConfirmAssignedOrderPage() {
    const { confirmOrder, loading, error, success } = useConfirmAssignedOrder();
    const { userId, name, role, isAuthenticated, logout, team } = useAuth();
    const route = useRoute<ConfirmAssignedOrderRouteProp>();
    const navigation = useNavigation();
    const order = route.params?.order;

    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    if (!isAuthenticated || !userId || !name || !role) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Debes iniciar sesión para poder confirmar el pedido.</Text>
            </View>
        );
    }

    const teamName = typeof team === "object" ? team?.teamName : team;
    const user = { name: name ?? "", role: role ?? "", team: teamName ?? null };

    const handleConfirmOrder = async () => {
        if (!order) {
            setModalMessage("No se encontró el pedido a confirmar.");
            setModalVisible(true);
            return;
        }
        if (order.status?.toLowerCase() !== "assigneddelivery") {
            setModalMessage(`Solo se pueden confirmar pedidos con estado 'assignedDelivery'.\nEstado actual: ${order.status}`);
            setModalVisible(true);
            return;
        }

        await confirmOrder({ logisticOrderId: order.id, operatorUserId: userId as unknown as string });
    };

    useEffect(() => {
        if (success) {
            setModalMessage(`El pedido #${order?.id} fue confirmado correctamente. Lo podrás ver dentro del listado Pedidos Confirmados.`);
            setModalVisible(true);
        } else if (error) {
            setModalMessage(`Error al confirmar el pedido: ${error}`);
            setModalVisible(true);
        }
    }, [success, error]);

    const handleCloseModal = () => {
        setModalVisible(false);
        navigation.navigate("Dashboard" as never);
    };

    // 🔥 MAPEAMOS LABELS EN UN OBJETO SEPARADO (NO TOCAMOS LogisticOrder)
    const mappedOrder: LogisticOrderUI | null = order
        ? {
              ...order,
              deliveryPriorityLabel: mapPriority(order.deliveryPriority),
              paymentTypeLabel: mapPaymentToSpanish(order.paymentType),
              statusLabel: mayStatusToSpanish(order.status),
          }
        : null;

    return (
        <View style={{ flex: 1 }}>
            <NavbarDelivery user={user} isAuthenticated={isAuthenticated} logout={logout} />
            <View style={{ marginTop: 10, marginLeft: 10 }}>
                <GetBack />
            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
                <ConfirmOrderComponent order={mappedOrder} loading={loading} onConfirm={handleConfirmOrder} />
            </ScrollView>

            <Footer />

            <Modal transparent animationType="fade" visible={modalVisible} onRequestClose={handleCloseModal}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>{modalMessage}</Text>
                        <TouchableOpacity style={styles.modalButton} onPress={handleCloseModal}>
                            <Text style={styles.modalButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: "center",
    },
    modalButton: {
        backgroundColor: "#2196F3",
        borderRadius: 5,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    modalButtonText: {
        color: "white",
        fontWeight: "bold",
    },
});

// -------------------------
// 🔽 ENUMS Y FUNCIONES DE MAPEO
// -------------------------

enum AulixiliarPriorityType {
    High = "Alta",
    Medium = "Media",
    Low = "Baja",
}

enum AuxiliarPaymentType {
    Transfer = "Tranferencia",
    Credit_Card = "Tarjeta de credito",
    Debit_Card = "Tarjeta de debito",
    Cash = "Efectivo",
    Current_Account = "Cuenta corriente",
    Check = "Cheque",
    Promissory_Note = "Pagare",
    Unknown = "Tipo de pago desconocido",
}

enum AxuziliarStatusType {
    Delivered = "Entregado",
    OnTheWay = "En camino",
    PendingDelivery = "Confirmado",
    AssignedDelivery = "Asignado",
    CashVerified = "¡Verificado por Tesoreria!",
    PendingCashVerification = "En espera de Verificacion...",
    PendingIncidentResolution = "Pendiente con Incidente No resuelto",
    Unknown = "Desconocido",
}

const mapPriority = (priority: string | undefined): string => {
    switch (priority?.toLowerCase()) {
        case "high":
            return AulixiliarPriorityType.High;
        case "medium":
            return AulixiliarPriorityType.Medium;
        case "low":
            return AulixiliarPriorityType.Low;
        default:
            return AulixiliarPriorityType.Low;
    }
};

const mapPaymentToSpanish = (payment: string | undefined): string => {
    switch (payment?.toLowerCase()) {
        case "credit_card":
            return AuxiliarPaymentType.Credit_Card;
        case "debit_card":
            return AuxiliarPaymentType.Debit_Card;
        case "transfer":
            return AuxiliarPaymentType.Transfer;
        case "cash":
            return AuxiliarPaymentType.Cash;
        case "current_account":
            return AuxiliarPaymentType.Current_Account;
        case "check":
            return AuxiliarPaymentType.Check;
        case "promissory_note":
            return AuxiliarPaymentType.Promissory_Note;
        default:
            return AuxiliarPaymentType.Unknown;
    }
};

const mayStatusToSpanish = (status: string | undefined): string => {
    switch (status?.toLowerCase()) {
        case "delivered":
            return AxuziliarStatusType.Delivered;
        case "ontheway":
            return AxuziliarStatusType.OnTheWay;
        case "assigneddelivery":
            return AxuziliarStatusType.AssignedDelivery;
        case "pendingdelivery":
            return AxuziliarStatusType.PendingDelivery;
        case "cashverified":
            return AxuziliarStatusType.CashVerified;
        case "pendingcashverification":
            return AxuziliarStatusType.PendingCashVerification;
        case "pendingincidentresolution":
            return AxuziliarStatusType.PendingIncidentResolution;
        default:
            return AxuziliarStatusType.Unknown;
    }
};
