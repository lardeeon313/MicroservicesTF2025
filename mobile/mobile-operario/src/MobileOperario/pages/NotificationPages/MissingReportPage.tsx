import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import MissingReport from '../../components/Notification/MissingReport';
import { useRoute, type RouteProp } from '@react-navigation/native';
import type { DepotStackParamList } from '../../types/DepotStackType';
import type { ReportOrderMissingRequest } from '../../types/Missing';
import type { DepotOrderDTO } from '../../types/OrderDTO';
import { ValidationMissingReport } from '../../validations/ValidationMissingReport';
import NavbarOperator from '../../components/Navbar/NavbarOperator';
import { useAuth } from '../../Login/context/useAuth';
import { Modal, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Footer from '../../../components/Footer';
import GetBack from '../../../components/GetBack';

type MissingRouteProp = RouteProp<DepotStackParamList, 'MissingReport'>;

const MissingPage = () => {
    const { params } = useRoute<MissingRouteProp>();
    const order: DepotOrderDTO = params.order;
    type NavigationProp = NativeStackNavigationProp<DepotStackParamList>;

    const navigation = useNavigation<NavigationProp>();

    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [submittedDescription, setSubmittedDescription] = useState<string | null>(null);


    const { userId, name, role, isAuthenticated, logout, team } = useAuth();
      
    const teamName = typeof team === 'object' ? team?.teamName : team;
      
    const user = userId && name && role
        ? { id: userId, name, role, team: teamName ?? null } 
        : null;

    if (!userId) {
        throw new Error("El usuario no está autenticado");
    }

    const [description, setDescription] = useState('');

    // --- 1. AÑADIMOS EL ESTADO PARA MANEJAR LA FALLA DE MARCA ---
    const [missingItemsState, setMissingItemsState] = useState(
        order.items.map(item => ({
            ...item,
            isMissing: false,
            missingQuantity: item.quantity,
            missingQuantityInput: String(item.quantity),
            maxQuantity: item.quantity,
            hasBrandIssue: false, // Para saber si el botón de "Falla Marca" está activo
            brandIssueDescription: '', // Para guardar el texto del input de la marca
            packagingType: item.packagingType || 'No aplica'
        }))
    );
    
    const handleToggleCheckbox = (index: number) => {
        const updated = [...missingItemsState];
        const currentItem = updated[index];
        currentItem.isMissing = !currentItem.isMissing;

        if (!currentItem.isMissing) {
            currentItem.missingQuantity = currentItem.quantity;
            currentItem.missingQuantityInput = String(currentItem.quantity);
            // También reseteamos el estado de la marca al desmarcar
            currentItem.hasBrandIssue = false;
            currentItem.brandIssueDescription = '';
        }
        setMissingItemsState(updated);
    };

    const handleQuantityTextChange = (index: number, text: string) => {
        const updated = [...missingItemsState];
        const numericValue = text.replace(/[^0-9]/g, '');
        updated[index].missingQuantityInput = numericValue;
        updated[index].missingQuantity = numericValue === '' ? 0 : parseInt(numericValue, 10);
        setMissingItemsState(updated);
        //console.log(`handleQuantityTextChange - Índice: ${index}, missingQuantityInput: ${numericValue}, missingQuantity: ${updated[index].missingQuantity}`);
    };

    const handleQuantityEndEditing = (index: number) => {
        const updated = [...missingItemsState];
        const currentItem = updated[index];
        let parsedQty = parseInt(currentItem.missingQuantityInput || '0', 10);
        if (isNaN(parsedQty)) parsedQty = 0;
        const validQty = Math.min(parsedQty, currentItem.maxQuantity);
        currentItem.missingQuantity = validQty;
        currentItem.missingQuantityInput = String(validQty);
        setMissingItemsState(updated);
        //console.log(`handleQuantityEndEditing - INDICE : ${index}, missingQuantity: ${validQty}`);
    };

    
    // --- 2. AÑADIMOS LAS FUNCIONES PARA MANEJAR LA FALLA DE MARCA ---
    const handleToggleBrandIssue = (index: number) => {
        const updated = [...missingItemsState];
        updated[index].hasBrandIssue = !updated[index].hasBrandIssue;
        if (!updated[index].hasBrandIssue) {
            updated[index].brandIssueDescription = ''; // Limpiar descripción si se desactiva
        }
        setMissingItemsState(updated);
    };

    const handleBrandIssueChange = (index: number, text: string) => {
        const updated = [...missingItemsState];
        updated[index].brandIssueDescription = text;
        setMissingItemsState(updated);
    };

    const onSubmit = () => {
        console.log('Estado de missingItemsState antes de enviar:', missingItemsState);
            const selectedItems = missingItemsState
                .filter(item => item.isMissing && item.missingQuantity > 0)
                .map(item => {
                    let finalBrand = item.productBrand;
                    if (item.hasBrandIssue && item.brandIssueDescription.trim()) {
                        finalBrand = item.brandIssueDescription.trim();
                    }
                    console.log(`Item seleccionado - Nombre: ${item.productName}, Embalaje: ${item.packagingType}, Cantidad faltante: ${item.missingQuantity}`);
                    return {
                        orderItemId: item.id,
                        productName: item.productName,
                        productBrand: finalBrand,
                        packaging: item.packagingType ?? 'No aplica',
                        quantity: item.missingQuantity,
                    };
                });
            //console.log('Items seleccionados para enviar:', selectedItems);

        if (!description.trim() && selectedItems.length === 0) {
            Alert.alert('Error', 'Debe ingresar una descripción o seleccionar al menos un producto con cantidad mayor a cero.');
            return;
        }

        const missingRequest: ReportOrderMissingRequest = {
            depotOrderId: order.depotOrderId,
            operatorUserId: userId,
            salesOrderId: order.salesOrderId,
            missingReason: 'Faltante detectado',
            missingDescription: description.trim(),
            missingItems: selectedItems,
        };

        

        ValidationMissingReport(description, missingRequest, () => {
            setSubmittedDescription(description.trim() || null);
            setSuccessModalVisible(true);

            setDescription('');
            setMissingItemsState(order.items.map(item => ({
                ...item,
                isMissing: false,
                missingQuantity: item.quantity,
                missingQuantityInput: String(item.quantity),
                maxQuantity: item.quantity,
                hasBrandIssue: false,
                brandIssueDescription: '',
            })));
        });
    };

    return (
        <View style={{ flex: 1 }}>
            <NavbarOperator user={user} isAuthenticated={isAuthenticated} logout={logout} />
            <View style={{ marginTop: 10, marginLeft: 10}}>
                <GetBack/>
            </View>
            <Modal
                    transparent
                    animationType="fade"
                    visible={successModalVisible}
                    onRequestClose={() => setSuccessModalVisible(false)}
                >
                    <View style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <View style={{
                            width: '85%',
                            backgroundColor: '#fff',
                            borderRadius: 12,
                            padding: 20,
                            alignItems: 'center',
                        }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
                                Notificación enviada
                            </Text>

                            <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 10 }}>
                                {submittedDescription || 'Sin descripción'}
                            </Text>

                            <Text style={{ fontSize: 14, color: '#555', textAlign: 'center', marginBottom: 20 }}>
                                El pedido ahora se encuentra en la sección de
                                {"\n"}
                                <Text style={{ fontWeight: 'bold' }}>Pedidos con faltantes</Text>.
                            </Text>

                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#2563eb',
                                    paddingVertical: 10,
                                    paddingHorizontal: 30,
                                    borderRadius: 8,
                                }}
                                onPress={() => {
                                    setSuccessModalVisible(false);
                                    navigation.navigate('OperatorDashboard');
                                }}
                            >
                                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
                                    Aceptar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            <MissingReport
                description={description}
                onNotifyMissing={setDescription}
                onSubmit={onSubmit}
                missingItemsState={missingItemsState}
                onToggleCheckbox={handleToggleCheckbox}
                onQuantityChange={handleQuantityTextChange}
                onQuantityEndEditing={handleQuantityEndEditing}
                // --- 4. PASAMOS LAS NUEVAS FUNCIONES AL COMPONENTE ---
                onToggleBrandIssue={handleToggleBrandIssue}
                onBrandIssueChange={handleBrandIssueChange}
            />
            <Footer/>
        </View>
    );
};

export default MissingPage;