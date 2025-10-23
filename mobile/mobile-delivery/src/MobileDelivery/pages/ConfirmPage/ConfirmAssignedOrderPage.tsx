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

type ConfirmAssignedOrderRouteProp = RouteProp<DeliveryStackParamList, "ConfirmAssignedOrder">;

export default function ConfirmAssignedOrderPage() {
    const { confirmOrder, loading, error, success } = useConfirmAssignedOrder();
    const { userId, name, role, isAuthenticated, logout, team } = useAuth();
    const route = useRoute<ConfirmAssignedOrderRouteProp>();
    const navigation = useNavigation(); // <-- hook de navegación
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

    const teamName = typeof team === 'object' ? team?.teamName : team;
    const user = { id: userId, name, role, team: teamName ?? null };

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

    // Observa cambios en success o error para mostrar modal
    useEffect(() => {
        if (success) {
            setModalMessage(`El pedido #${order?.id} fue confirmado correctamente.Lo podras ver dentro del mismo listado.`);
            setModalVisible(true);
        } else if (error) {
            setModalMessage(`Error al confirmar el pedido: ${error}`);
            setModalVisible(true);
        }
    }, [success, error]);

    const handleCloseModal = () => {
        setModalVisible(false);
        // Navegar a OrdersToDistribute
        navigation.navigate("Dashboard" as never);
    };

    return (
        <View style={{ flex: 1 }}>
            <NavbarDelivery user={user} isAuthenticated={isAuthenticated} logout={logout} />
            <View style={{ marginTop: 10, marginLeft: 10 }}>
                <GetBack />
            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
                <ConfirmOrderComponent order={order} loading={loading} onConfirm={handleConfirmOrder} />
            </ScrollView>
            <Footer />

            {/* Modal */}
            <Modal
                transparent
                animationType="fade"
                visible={modalVisible}
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>{modalMessage}</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={handleCloseModal} // <-- ahora navega al cerrar
                        >
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
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButton: {
        backgroundColor: '#2196F3',
        borderRadius: 5,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
